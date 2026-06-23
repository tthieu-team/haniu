<#
.SYNOPSIS
    Database Backup & Restore Manager for Haniu
.DESCRIPTION
    Backup or restore PostgreSQL database (local or Neon production)
.USAGE
    .\db_manager.ps1 backup              # Backup local DB
    .\db_manager.ps1 backup -Target neon  # Backup Neon production DB
    .\db_manager.ps1 restore             # Restore local DB from latest backup
    .\db_manager.ps1 restore -BackupName "2026-06-23_02-30-00"  # Restore specific backup
    .\db_manager.ps1 list                # List all available backups
#>

param(
    [Parameter(Position=0)]
    [ValidateSet("backup", "restore", "list")]
    [string]$Action = "backup",
    
    [ValidateSet("local", "neon")]
    [string]$Target = "local",
    
    [string]$BackupName = ""
)

# ============================================================
# CONFIGURATION - Update these if your credentials change
# ============================================================
$CONFIG = @{
    Local = "postgresql://postgres:admin@localhost:5432/haniu"
    Neon  = "postgresql://neondb_owner:npg_46oYNCcgiTfp@ep-misty-waterfall-aohj43xi.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    BackupRoot = "d:\FullStack\haniu\db_backups"
}

# Tables in dependency order (parents first, children last)
$TABLES = @(
    "brands","categories","occasions","recipients","collections",
    "attribute_definitions","system_configurations","users",
    "products","product_variants","product_medias","product_attributes",
    "products_occasions","products_recipients",
    "carts","cart_items","orders","order_items","payments",
    "reviews","wishlists","user_addresses","refresh_tokens","verification_codes",
    "posts","stories","testimonials","ugc_items","banners","coupons",
    "notifications","contact_submissions","audit_logs","translation_caches",
    "photobooth_templates","photobooth_events","photobooth_sessions",
    "photobooth_assets","neon_databases"
)

# ============================================================
# FUNCTIONS
# ============================================================

function Write-Banner($text) {
    $line = "=" * 60
    Write-Host "`n$line" -ForegroundColor DarkCyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "$line`n" -ForegroundColor DarkCyan
}

function Get-DbUrl($target) {
    if ($target -eq "neon") { return $CONFIG.Neon }
    return $CONFIG.Local
}

function Test-Connection($url, $label) {
    Write-Host "  Testing $label connection..." -NoNewline
    $result = psql $url -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor Green
        return $true
    } else {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  Error: $result" -ForegroundColor Red
        return $false
    }
}

# ============================================================
# BACKUP
# ============================================================
function Invoke-Backup($target) {
    $url = Get-DbUrl $target
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $backupDir = "$($CONFIG.BackupRoot)\${target}_$timestamp"
    
    Write-Banner "BACKUP DATABASE [$($target.ToUpper())] - $timestamp"
    
    if (-not (Test-Connection $url $target)) { return }
    
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    
    # Get actual tables from DB
    $dbTables = @(psql $url -t -A -c "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;" 2>$null)
    $dbTables = $dbTables | Where-Object { $_.Trim() -ne "" }
    
    Write-Host "  Found $($dbTables.Count) tables in database.`n" -ForegroundColor Gray
    
    $successCount = 0
    $totalRows = 0
    
    foreach ($t in $TABLES) {
        if ($t -notin $dbTables) { 
            Write-Host "  [ SKIP ] $t (not in DB)" -ForegroundColor DarkGray
            continue 
        }
        
        Write-Host "  Exporting $t..." -NoNewline
        $f = "$backupDir\$t.csv"
        
        cmd /c "psql `"$url`" -c `"\copy $t TO STDOUT WITH (FORMAT csv, HEADER true)`" > `"$f`" 2>nul"
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path $f) -and (Get-Item $f).Length -gt 2) {
            $rows = @(Get-Content $f -Encoding UTF8).Count - 1
            $totalRows += $rows
            $successCount++
            if ($rows -gt 0) {
                Write-Host " $rows rows" -ForegroundColor Green
            } else {
                Write-Host " empty" -ForegroundColor DarkGray
            }
        } else {
            Write-Host " error" -ForegroundColor Red
            if (Test-Path $f) { Remove-Item $f }
        }
    }
    
    # Also export any tables not in our predefined list
    foreach ($t in $dbTables) {
        if ($t -notin $TABLES) {
            Write-Host "  Exporting $t (extra)..." -NoNewline
            $f = "$backupDir\$t.csv"
            cmd /c "psql `"$url`" -c `"\copy $t TO STDOUT WITH (FORMAT csv, HEADER true)`" > `"$f`" 2>nul"
            if ($LASTEXITCODE -eq 0 -and (Test-Path $f) -and (Get-Item $f).Length -gt 2) {
                $rows = @(Get-Content $f -Encoding UTF8).Count - 1
                $totalRows += $rows
                $successCount++
                Write-Host " $rows rows" -ForegroundColor Green
            } else {
                Write-Host " error" -ForegroundColor Red
                if (Test-Path $f) { Remove-Item $f }
            }
        }
    }
    
    # Save metadata
    @{
        Timestamp = $timestamp
        Target = $target
        Tables = $successCount
        TotalRows = $totalRows
        CreatedAt = (Get-Date).ToString("o")
    } | ConvertTo-Json | Out-File "$backupDir\_metadata.json" -Encoding UTF8
    
    Write-Banner "BACKUP COMPLETE"
    Write-Host "  Location : $backupDir" -ForegroundColor White
    Write-Host "  Tables   : $successCount" -ForegroundColor White
    Write-Host "  Rows     : $totalRows" -ForegroundColor White
    Write-Host "  To restore: .\db_manager.ps1 restore -BackupName `"${target}_$timestamp`"" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================================
# RESTORE
# ============================================================
function Invoke-Restore($backupName) {
    # Find backup directory
    if ([string]::IsNullOrWhiteSpace($backupName)) {
        # Use latest backup
        $latestDir = Get-ChildItem $CONFIG.BackupRoot -Directory -ErrorAction SilentlyContinue | 
                     Sort-Object Name -Descending | Select-Object -First 1
        if (-not $latestDir) {
            Write-Host "  No backups found in $($CONFIG.BackupRoot)" -ForegroundColor Red
            return
        }
        $backupDir = $latestDir.FullName
        $backupName = $latestDir.Name
    } else {
        $backupDir = "$($CONFIG.BackupRoot)\$backupName"
    }
    
    if (-not (Test-Path $backupDir)) {
        Write-Host "  Backup not found: $backupDir" -ForegroundColor Red
        Write-Host "  Run '.\db_manager.ps1 list' to see available backups." -ForegroundColor Yellow
        return
    }
    
    # Determine target from backup name
    if ($backupName -like "neon_*") { $restoreTarget = "neon" } 
    else { $restoreTarget = "local" }
    $url = Get-DbUrl $restoreTarget
    
    Write-Banner "RESTORE DATABASE [$($restoreTarget.ToUpper())] from '$backupName'"
    
    # Safety confirmation for Neon
    if ($restoreTarget -eq "neon") {
        Write-Host "  WARNING: You are about to restore to PRODUCTION (Neon)!" -ForegroundColor Red
        $confirm = Read-Host "  Type 'YES' to confirm"
        if ($confirm -ne "YES") {
            Write-Host "  Cancelled." -ForegroundColor Yellow
            return
        }
    }
    
    if (-not (Test-Connection $url $restoreTarget)) { return }
    
    # Read metadata
    $metaFile = "$backupDir\_metadata.json"
    if (Test-Path $metaFile) {
        $meta = Get-Content $metaFile -Encoding UTF8 | ConvertFrom-Json
        Write-Host "  Backup from: $($meta.CreatedAt)" -ForegroundColor Gray
        Write-Host "  Tables: $($meta.Tables), Rows: $($meta.TotalRows)`n" -ForegroundColor Gray
    }
    
    # Get CSV files
    $csvFiles = Get-ChildItem "$backupDir\*.csv" -ErrorAction SilentlyContinue
    if ($csvFiles.Count -eq 0) {
        Write-Host "  No CSV files found in backup." -ForegroundColor Red
        return
    }
    
    # Disable triggers
    Write-Host "  Disabling FK constraints..." -NoNewline
    psql $url -q -c "DO `$`$`$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP EXECUTE 'ALTER TABLE public.'||quote_ident(r.tablename)||' DISABLE TRIGGER ALL'; END LOOP; END `$`$`$;" 2>$null
    Write-Host " OK" -ForegroundColor Green
    
    # Build ordered list: use predefined order + any extra tables from backup
    $orderedTables = @()
    foreach ($t in $TABLES) {
        if (Test-Path "$backupDir\$t.csv") { $orderedTables += $t }
    }
    foreach ($csv in $csvFiles) {
        $t = $csv.BaseName
        if ($t -notin $orderedTables) { $orderedTables += $t }
    }
    
    # Truncate in reverse order
    Write-Host "  Clearing tables..." -NoNewline
    $rev = $orderedTables.Clone(); [Array]::Reverse($rev)
    foreach ($t in $rev) {
        psql $url -q -c "TRUNCATE TABLE $t CASCADE;" 2>$null
    }
    Write-Host " OK`n" -ForegroundColor Green
    
    # Import
    $successCount = 0
    $failCount = 0
    
    foreach ($t in $orderedTables) {
        $f = "$backupDir\$t.csv"
        
        # Read header for column names
        $header = (Get-Content $f -First 1 -Encoding UTF8).Trim()
        if ([string]::IsNullOrWhiteSpace($header)) { continue }
        
        $rows = @(Get-Content $f -Encoding UTF8).Count - 1
        if ($rows -le 0) { continue }
        
        Write-Host "  Importing $t ($rows rows)..." -NoNewline
        
        $fwdPath = ($f -replace '\\','/')
        cmd /c "psql `"$url`" -c `"\copy $t($header) FROM '$fwdPath' WITH (FORMAT csv, HEADER true)`" 2>&1" | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host " OK" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host " FAILED" -ForegroundColor Red
            $failCount++
        }
    }
    
    # Re-enable triggers
    Write-Host "`n  Re-enabling FK constraints..." -NoNewline
    psql $url -q -c "DO `$`$`$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP EXECUTE 'ALTER TABLE public.'||quote_ident(r.tablename)||' ENABLE TRIGGER ALL'; END LOOP; END `$`$`$;" 2>$null
    Write-Host " OK" -ForegroundColor Green
    
    Write-Banner "RESTORE COMPLETE"
    Write-Host "  Success: $successCount tables" -ForegroundColor Green
    if ($failCount -gt 0) { Write-Host "  Failed : $failCount tables" -ForegroundColor Red }
    Write-Host ""
}

# ============================================================
# LIST BACKUPS
# ============================================================
function Invoke-ListBackups {
    Write-Banner "AVAILABLE BACKUPS"
    
    if (-not (Test-Path $CONFIG.BackupRoot)) {
        Write-Host "  No backups found. Run '.\db_manager.ps1 backup' first." -ForegroundColor Yellow
        return
    }
    
    $dirs = Get-ChildItem $CONFIG.BackupRoot -Directory | Sort-Object Name -Descending
    
    if ($dirs.Count -eq 0) {
        Write-Host "  No backups found." -ForegroundColor Yellow
        return
    }
    
    Write-Host "  {0,-35} {1,-10} {2,-10} {3}" -f "NAME", "TARGET", "TABLES", "DATE" -ForegroundColor White
    Write-Host "  $('-' * 70)" -ForegroundColor DarkGray
    
    foreach ($dir in $dirs) {
        $metaFile = "$($dir.FullName)\_metadata.json"
        $csvCount = (Get-ChildItem "$($dir.FullName)\*.csv" -ErrorAction SilentlyContinue).Count
        $target = if ($dir.Name -like "neon_*") { "neon" } else { "local" }
        $date = $dir.CreationTime.ToString("yyyy-MM-dd HH:mm")
        
        if (Test-Path $metaFile) {
            $meta = Get-Content $metaFile -Encoding UTF8 | ConvertFrom-Json
            Write-Host "  {0,-35} {1,-10} {2,-10} {3}" -f $dir.Name, $target, "$($meta.TotalRows) rows", $date
        } else {
            Write-Host "  {0,-35} {1,-10} {2,-10} {3}" -f $dir.Name, $target, "$csvCount files", $date
        }
    }
    
    Write-Host "`n  To restore: .\db_manager.ps1 restore -BackupName `"<NAME>`"" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================================
# MAIN
# ============================================================
switch ($Action) {
    "backup"  { Invoke-Backup $Target }
    "restore" { Invoke-Restore $BackupName }
    "list"    { Invoke-ListBackups }
}
