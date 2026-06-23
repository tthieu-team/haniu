# Sync Neon Production DB to Local PostgreSQL
# Uses cmd.exe redirect to avoid PowerShell UTF-16 encoding issue

$NEON = "postgresql://neondb_owner:npg_46oYNCcgiTfp@ep-misty-waterfall-aohj43xi.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
$LOCAL = "postgresql://postgres:admin@localhost:5432/haniu"
$DUMP_DIR = "d:\FullStack\haniu\neon_dump"

New-Item -ItemType Directory -Force -Path $DUMP_DIR | Out-Null

$tables = @(
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

# === STEP 1: Export from Neon using cmd.exe to get proper UTF-8 ===
Write-Host "=== Step 1: Exporting from Neon ===" -ForegroundColor Cyan
foreach ($t in $tables) {
    Write-Host "  Exporting $t..." -NoNewline
    $f = "$DUMP_DIR\$t.csv"
    cmd /c "psql `"$NEON`" -c `"\copy $t TO STDOUT WITH (FORMAT csv, HEADER true)`" > `"$f`" 2>nul"
    if ($LASTEXITCODE -eq 0 -and (Test-Path $f) -and (Get-Item $f).Length -gt 2) {
        $rows = @(Get-Content $f -Encoding UTF8).Count - 1
        Write-Host " OK ($rows rows)" -ForegroundColor Green
    } else {
        Write-Host " SKIP" -ForegroundColor Yellow
        if (Test-Path $f) { Remove-Item $f }
    }
}

# === STEP 2: Disable triggers & truncate local ===
Write-Host "`n=== Step 2: Clearing local DB ===" -ForegroundColor Cyan
psql $LOCAL -q -c "DO `$`$`$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP EXECUTE 'ALTER TABLE public.'||quote_ident(r.tablename)||' DISABLE TRIGGER ALL'; END LOOP; END `$`$`$;" 2>$null
$rev = $tables.Clone(); [Array]::Reverse($rev)
foreach ($t in $rev) { psql $LOCAL -q -c "TRUNCATE TABLE $t CASCADE;" 2>$null }
Write-Host "  Done." -ForegroundColor Green

# === STEP 3: Import with explicit column names from CSV header ===
Write-Host "`n=== Step 3: Importing to local ===" -ForegroundColor Cyan
foreach ($t in $tables) {
    $f = "$DUMP_DIR\$t.csv"
    if (-not (Test-Path $f)) { continue }
    
    # Read header to get column names
    $header = (Get-Content $f -First 1 -Encoding UTF8).Trim()
    if ([string]::IsNullOrWhiteSpace($header)) { continue }
    
    $rows = @(Get-Content $f -Encoding UTF8).Count - 1
    if ($rows -le 0) {
        Write-Host "  Skipping $t (0 rows)" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "  Importing $t ($rows rows)..." -NoNewline
    
    # Use \copy with explicit column list matching CSV header order
    $fwdPath = $f -replace '\\','/'
    cmd /c "psql `"$LOCAL`" -c `"\copy $t($header) FROM '$fwdPath' WITH (FORMAT csv, HEADER true)`" 2>&1"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " FAILED" -ForegroundColor Red
    }
}

# Re-enable triggers
psql $LOCAL -q -c "DO `$`$`$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP EXECUTE 'ALTER TABLE public.'||quote_ident(r.tablename)||' ENABLE TRIGGER ALL'; END LOOP; END `$`$`$;" 2>$null

Write-Host "`n=== ALL DONE! Local DB restored from Neon ===" -ForegroundColor Green
