package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.system.NeonDatabase;
import com.haniu.tthieu.haniu.repository.NeonDatabaseRepository;
import com.haniu.tthieu.haniu.config.DatabaseConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/db-rotation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class NeonDatabaseController {

    private final NeonDatabaseRepository repository;
    private final com.haniu.tthieu.haniu.config.DatabaseSeeder databaseSeeder;
    private final jakarta.persistence.EntityManagerFactory entityManagerFactory;
    private final com.haniu.tthieu.haniu.service.DatabaseBackupService backupService;

    @GetMapping
    public ResponseEntity<List<NeonDatabase>> getAll() {
        return ResponseEntity.ok(repository.findAllByOrderBySortOrderAsc());
    }

    @PostMapping
    public ResponseEntity<NeonDatabase> create(@RequestBody NeonDatabase neonDatabase) {
        if (neonDatabase.isActive()) {
            deactivateAll();
        }
        NeonDatabase saved = repository.save(neonDatabase);
        if (saved.isActive()) {
            triggerRotationIfProduction(saved.getConnectionUrl());
        }
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NeonDatabase> update(@PathVariable UUID id, @RequestBody NeonDatabase request) {
        NeonDatabase db = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Database connection not found"));
        db.setName(request.getName());
        db.setConnectionUrl(request.getConnectionUrl());
        db.setSortOrder(request.getSortOrder());
        
        if (request.isActive() && !db.isActive()) {
            deactivateAll();
            db.setActive(true);
            db.setLastSwitchedAt(LocalDateTime.now());
        } else if (!request.isActive()) {
            db.setActive(false);
        }
        
        NeonDatabase saved = repository.save(db);
        if (saved.isActive()) {
            triggerRotationIfProduction(saved.getConnectionUrl());
        }
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable UUID id) {
        NeonDatabase db = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Database connection not found"));
        try {
            backupService.createBackup("AUTO_DELETE_" + db.getName(), db.getConnectionUrl());
        } catch (Exception e) {
            System.err.println(">>> [DB Delete] Auto-backup failed: " + e.getMessage());
        }
        repository.delete(db);
        return ResponseEntity.ok(Map.of("message", "Xóa cấu hình database thành công (đã tự động backup)"));
    }

    @PostMapping("/rotate")
    public ResponseEntity<Map<String, Object>> rotate() {
        List<NeonDatabase> list = repository.findAllByOrderBySortOrderAsc();
        if (list.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Danh sách database trống"));
        }

        NeonDatabase currentActive = list.stream()
                .filter(NeonDatabase::isActive)
                .findFirst()
                .orElse(null);

        String oldUrl = currentActive != null ? currentActive.getConnectionUrl() : null;
        if (oldUrl == null) {
            oldUrl = System.getProperty("DATABASE_URL_LOCAL");
            if (oldUrl == null) oldUrl = System.getenv("DATABASE_URL_LOCAL");
        }
        if (oldUrl == null) {
            oldUrl = System.getProperty("DATABASE_URL_POSTGRE");
            if (oldUrl == null) oldUrl = System.getenv("DATABASE_URL_POSTGRE");
        }

        int nextIndex = 0;
        if (currentActive != null) {
            int currentIndex = list.indexOf(currentActive);
            nextIndex = (currentIndex + 1) % list.size();
        }

        deactivateAll();
        NeonDatabase nextActive = list.get(nextIndex);
        nextActive.setActive(true);
        nextActive.setLastSwitchedAt(LocalDateTime.now());
        repository.save(nextActive);

        // Copy data from old active connection to the next active connection
        if (oldUrl != null && !oldUrl.equals(nextActive.getConnectionUrl())) {
            try {
                copyDataBetweenDatabases(oldUrl, nextActive.getConnectionUrl());
            } catch (Exception e) {
                System.err.println(">>> [DB Rotation] Failed to copy data during rotation: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(500).body(Map.of(
                    "message", "Xoay vòng thất bại khi đồng bộ dữ liệu: " + e.getMessage(),
                    "error", e.toString()
                ));
            }
        }

        triggerRotationIfProduction(nextActive.getConnectionUrl());

        return ResponseEntity.ok(Map.of(
            "message", "Xoay vòng database và đồng bộ dữ liệu thành công",
            "oldActive", currentActive != null ? currentActive.getName() : "Không có",
            "newActive", nextActive.getName(),
            "connectionUrl", nextActive.getConnectionUrl()
        ));
    }

    @PostMapping("/sync-current")
    public ResponseEntity<Map<String, Object>> syncCurrent(@RequestBody(required = false) Map<String, String> body) {
        // 1. Determine target DB from request
        String targetDbId = (body != null) ? body.get("targetDbId") : null;
        if (targetDbId == null || targetDbId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn database để đồng bộ"));
        }

        NeonDatabase targetDb;
        try {
            targetDb = repository.findById(UUID.fromString(targetDbId))
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy database với ID: " + targetDbId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "ID database không hợp lệ"));
        }

        String targetUrl = targetDb.getConnectionUrl();
        String activeDbName = targetDb.getName();

        // 2. Source = the database this app is currently connected to
        String sourceUrl = DatabaseConfig.getCurrentActiveUrl();
        if (sourceUrl == null || sourceUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không xác định được database nguồn (local) đang kết nối"));
        }

        // 3. Prevent syncing to self
        if (sourceUrl.trim().equals(targetUrl.trim())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Database nguồn và đích giống nhau, không cần đồng bộ"));
        }

        System.out.println(">>> [DB Sync] Source (current app): " + sourceUrl);
        System.out.println(">>> [DB Sync] Target (selected): " + targetUrl);

        // 4. Copy all data from source to target (drop + recreate + insert)
        try {
            copyDataBetweenDatabases(sourceUrl, targetUrl);
            System.out.println(">>> [DB Sync] Copy completed successfully.");
        } catch (Exception e) {
            System.err.println(">>> [DB Sync] FATAL ERROR during sync: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "message", "Đồng bộ cơ sở dữ liệu thất bại: " + e.getMessage(),
                "error", e.toString()
            ));
        }

        // 5. Switch app connection to target and run seeder
        triggerRotationIfProduction(targetUrl);

        // 6. Update active database
        if (!targetDb.isActive()) {
            deactivateAll();
            targetDb.setActive(true);
            targetDb.setLastSwitchedAt(LocalDateTime.now());
            repository.save(targetDb);
        }

        return ResponseEntity.ok(Map.of(
            "message", "Đồng bộ toàn bộ dữ liệu thành công từ local lên: " + activeDbName,
            "activeDb", activeDbName,
            "connectionUrl", targetUrl
        ));
    }

    @PostMapping("/sync-multiple")
    public ResponseEntity<Map<String, Object>> syncMultiple(@RequestBody Map<String, Object> body) {
        String sourceDbId = (String) body.get("sourceDbId");
        List<String> targetDbIds = (List<String>) body.get("targetDbIds");

        if (sourceDbId == null || targetDbIds == null || targetDbIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn database nguồn và ít nhất 1 database đích"));
        }

        String sourceUrl;
        String sourceName;
        if ("local".equalsIgnoreCase(sourceDbId)) {
            sourceUrl = com.haniu.tthieu.haniu.config.DatabaseConfig.getCurrentActiveUrl();
            sourceName = "Local DB";
        } else {
            NeonDatabase src = repository.findById(UUID.fromString(sourceDbId))
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy database nguồn"));
            sourceUrl = src.getConnectionUrl();
            sourceName = src.getName();
        }

        List<String> successDbs = new java.util.ArrayList<>();
        List<String> failedDbs = new java.util.ArrayList<>();

        for (String targetId : targetDbIds) {
            try {
                String targetUrl;
                String targetName;
                if ("local".equalsIgnoreCase(targetId)) {
                    targetUrl = System.getProperty("DATABASE_URL_LOCAL");
                    if (targetUrl == null) targetUrl = System.getenv("DATABASE_URL_LOCAL");
                    if (targetUrl == null) targetUrl = "jdbc:postgresql://localhost:5432/haniu";
                    targetName = "Local DB";
                } else {
                    NeonDatabase targetDb = repository.findById(UUID.fromString(targetId))
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy database đích: " + targetId));
                    targetUrl = targetDb.getConnectionUrl();
                    targetName = targetDb.getName();
                }

                if (sourceUrl.trim().equals(targetUrl.trim())) {
                    continue;
                }

                try {
                    backupService.createBackup("AUTO_SYNC_" + targetName, targetUrl);
                } catch (Exception backupEx) {
                    System.err.println(">>> [Multi-Sync] Failed auto-backup: " + backupEx.getMessage());
                }

                copyDataBetweenDatabases(sourceUrl, targetUrl);
                successDbs.add(targetName);
            } catch (Exception e) {
                e.printStackTrace();
                failedDbs.add(targetId + " (" + e.getMessage() + ")");
            }
        }

        return ResponseEntity.ok(Map.of(
            "message", "Đồng bộ hoàn thành",
            "source", sourceName,
            "success", successDbs,
            "failed", failedDbs
        ));
    }

    @GetMapping("/backups")
    public ResponseEntity<List<com.haniu.tthieu.haniu.service.DatabaseBackupService.BackupMetadata>> getBackups() {
        return ResponseEntity.ok(backupService.listBackups());
    }

    @PostMapping("/backups/create")
    public ResponseEntity<Map<String, Object>> createBackup(@RequestBody Map<String, String> body) {
        String dbId = body.get("dbId");
        if (dbId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu ID database"));
        }

        try {
            String url;
            String name;
            if ("local".equalsIgnoreCase(dbId)) {
                url = com.haniu.tthieu.haniu.config.DatabaseConfig.getCurrentActiveUrl();
                name = "Local_DB";
            } else {
                NeonDatabase db = repository.findById(UUID.fromString(dbId))
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy database"));
                url = db.getConnectionUrl();
                name = db.getName();
            }

            var meta = backupService.createBackup(name, url);
            return ResponseEntity.ok(Map.of("message", "Sao lưu thành công", "metadata", meta));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Sao lưu thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/backups/restore")
    public ResponseEntity<Map<String, Object>> restoreBackup(@RequestBody Map<String, String> body) {
        String backupName = body.get("backupName");
        String targetDbId = body.get("targetDbId");

        if (backupName == null || targetDbId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu thông tin backup hoặc target DB"));
        }

        try {
            String url;
            String name;
            if ("local".equalsIgnoreCase(targetDbId)) {
                url = com.haniu.tthieu.haniu.config.DatabaseConfig.getCurrentActiveUrl();
                name = "Local_DB";
            } else {
                NeonDatabase db = repository.findById(UUID.fromString(targetDbId))
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy database đích"));
                url = db.getConnectionUrl();
                name = db.getName();
            }

            try {
                backupService.createBackup("AUTO_RESTORE_OVERWRITE_" + name, url);
            } catch (Exception backupEx) {
                System.err.println(">>> [Restore Backup] Auto-backup failed: " + backupEx.getMessage());
            }

            backupService.restoreBackup(backupName, url);
            return ResponseEntity.ok(Map.of("message", "Phục hồi dữ liệu thành công lên database: " + name));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Phục hồi thất bại: " + e.getMessage()));
        }
    }

    @DeleteMapping("/backups/{name}")
    public ResponseEntity<Map<String, String>> deleteBackup(@PathVariable String name) {
        try {
            backupService.deleteBackup(name);
            return ResponseEntity.ok(Map.of("message", "Xóa bản sao lưu thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Xóa bản sao lưu thất bại: " + e.getMessage()));
        }
    }

    private void copyDataBetweenDatabases(String sourceUrl, String targetUrl) throws Exception {
        if (sourceUrl == null || targetUrl == null || sourceUrl.trim().equals(targetUrl.trim())) {
            return;
        }

        System.out.println(">>> [DB Rotation] Starting DYNAMIC data copy from: " + sourceUrl + " to: " + targetUrl);
        var sourceInfo = new com.haniu.tthieu.haniu.config.DatabaseConfig.DbConnectionInfo(sourceUrl);
        var targetInfo = new com.haniu.tthieu.haniu.config.DatabaseConfig.DbConnectionInfo(targetUrl);

        java.util.Properties sourceProps = new java.util.Properties();
        if (sourceInfo.username != null) sourceProps.setProperty("user", sourceInfo.username);
        if (sourceInfo.password != null) sourceProps.setProperty("password", sourceInfo.password);

        java.util.Properties targetProps = new java.util.Properties();
        if (targetInfo.username != null) targetProps.setProperty("user", targetInfo.username);
        if (targetInfo.password != null) targetProps.setProperty("password", targetInfo.password);

        try (java.sql.Connection srcConn = java.sql.DriverManager.getConnection(sourceInfo.jdbcUrl, sourceProps);
             java.sql.Connection destConn = java.sql.DriverManager.getConnection(targetInfo.jdbcUrl, targetProps)) {

            srcConn.setAutoCommit(false);
            destConn.setAutoCommit(false);

            // Fetch list of all tables dynamically from source database schema
            List<String> tables = new java.util.ArrayList<>();
            try (java.sql.Statement stmt = srcConn.createStatement();
                 java.sql.ResultSet rs = stmt.executeQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'")) {
                while (rs.next()) {
                    tables.add(rs.getString("table_name"));
                }
            }
            System.out.println(">>> [DB Rotation] Found " + tables.size() + " tables to copy dynamically: " + tables);

            // 1. Drop existing tables on the target database to ensure a clean slate
            System.out.println(">>> [DB Rotation] Dropping all existing tables on target database...");
            List<String> targetTables = new java.util.ArrayList<>();
            try {
                java.sql.DatabaseMetaData dbmd = destConn.getMetaData();
                try (java.sql.ResultSet rs = dbmd.getTables(null, null, null, new String[]{"TABLE"})) {
                    while (rs.next()) {
                        String schema = rs.getString("TABLE_SCHEM");
                        if ("public".equalsIgnoreCase(schema)) {
                            targetTables.add(rs.getString("TABLE_NAME"));
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to fetch target tables for dropping: " + e.getMessage());
            }

            try (java.sql.Statement destStmt = destConn.createStatement()) {
                for (String table : targetTables) {
                    try {
                        destStmt.execute("DROP TABLE IF EXISTS " + table + " CASCADE");
                    } catch (Exception e) {
                        System.err.println("Failed to drop table " + table + ": " + e.getMessage());
                    }
                }
                destConn.commit();
            }

            // 2. Re-create schema on target database
            System.out.println(">>> [DB Rotation] Creating fresh database schema on target database...");
            try {
                org.hibernate.SessionFactory sessionFactory = entityManagerFactory.unwrap(org.hibernate.SessionFactory.class);
                var dynamicDs = com.haniu.tthieu.haniu.config.DatabaseConfig.getDynamicDataSourceInstance();
                dynamicDs.switchDataSource(targetUrl);
                sessionFactory.getSchemaManager().create(true);
                dynamicDs.switchDataSource(sourceUrl);
                System.out.println(">>> [DB Rotation] Target schema re-created successfully.");
            } catch (Exception schemaEx) {
                System.err.println("Failed to initialize target schema: " + schemaEx.getMessage());
            }

            // 3. Copy row by row for each table dynamically (handling foreign key dependencies via retry queue)
            java.util.List<String> queue = new java.util.ArrayList<>(tables);
            int lastQueueSize = -1;
            int consecutiveFailures = 0;
            java.util.Map<String, Exception> tableErrors = new java.util.HashMap<>();

            System.out.println(">>> [DB Rotation] Copying " + queue.size() + " tables dynamically resolving dependencies...");

            while (!queue.isEmpty()) {
                if (queue.size() == lastQueueSize) {
                    consecutiveFailures++;
                    if (consecutiveFailures > 3) {
                        // Failed to progress, throw the errors
                        String failedTables = String.join(", ", queue);
                        Exception firstError = tableErrors.get(queue.get(0));
                        throw new RuntimeException("Cannot resolve foreign key dependencies for tables: [" + failedTables + "]. First error: " + (firstError != null ? firstError.getMessage() : "unknown"), firstError);
                    }
                } else {
                    lastQueueSize = queue.size();
                    consecutiveFailures = 0;
                }

                String table = queue.remove(0);
                String selectSql = "SELECT * FROM " + table;
                
                try (java.sql.Statement srcStmt = srcConn.createStatement();
                     java.sql.ResultSet srcRs = srcStmt.executeQuery(selectSql)) {

                    java.sql.ResultSetMetaData meta = srcRs.getMetaData();
                    int colCount = meta.getColumnCount();
                    if (colCount == 0) continue;

                    StringBuilder insertSql = new StringBuilder("INSERT INTO " + table + " (");
                    StringBuilder valuesPart = new StringBuilder("VALUES (");
                    for (int i = 1; i <= colCount; i++) {
                        insertSql.append(meta.getColumnName(i));
                        valuesPart.append("?");
                        if (i < colCount) {
                            insertSql.append(", ");
                            valuesPart.append(", ");
                        }
                    }
                    insertSql.append(") ").append(valuesPart).append(")");

                    try (java.sql.PreparedStatement destPstmt = destConn.prepareStatement(insertSql.toString())) {
                        int batchCount = 0;
                        while (srcRs.next()) {
                            for (int i = 1; i <= colCount; i++) {
                                destPstmt.setObject(i, srcRs.getObject(i));
                            }
                            destPstmt.addBatch();
                            batchCount++;
                            if (batchCount % 500 == 0) {
                                destPstmt.executeBatch();
                            }
                        }
                        if (batchCount % 500 != 0) {
                            destPstmt.executeBatch();
                        }
                        destConn.commit();
                        System.out.println(">>> [DB Rotation] Copied " + batchCount + " rows for table: " + table);
                        tableErrors.remove(table);
                    }
                } catch (Exception tableEx) {
                    destConn.rollback();
                    
                    String sqlState = "";
                    if (tableEx instanceof java.sql.SQLException) {
                        sqlState = ((java.sql.SQLException) tableEx).getSQLState();
                    }
                    
                    // SQLState 23503 is foreign key violation in PostgreSQL
                    if ("23503".equals(sqlState)) {
                        System.out.println(">>> [DB Rotation] Table " + table + " has foreign key violations. Retrying in next pass...");
                        queue.add(table);
                        tableErrors.put(table, tableEx);
                    } else {
                        System.err.println("Failed to copy table " + table + ": " + tableEx.getMessage());
                        tableEx.printStackTrace();
                        throw tableEx;
                    }
                }
            }

            // 4. Reset sequences for tables with serial/numeric primary keys
            try (java.sql.Statement destStmt = destConn.createStatement()) {
                for (String table : tables) {
                    try {
                        destStmt.execute("SELECT setval(pg_get_serial_sequence('" + table + "', 'id'), coalesce(max(id), 1)) FROM " + table);
                    } catch (Exception seqEx) {
                        // Ignore if table has no serial sequence
                    }
                }
                destConn.commit();
            }

            System.out.println(">>> [DB Rotation] Programmatic database data copy completed successfully!");
        } catch (Exception e) {
            System.err.println(">>> [DB Rotation] Error during programmatic data copy: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private void triggerRotationIfProduction(String connectionUrl) {
        var dynamicDs = com.haniu.tthieu.haniu.config.DatabaseConfig.getDynamicDataSourceInstance();
        if (dynamicDs != null) {
            try {
                // 1. Switch datasource URL to new database
                dynamicDs.switchDataSource(connectionUrl);

                // 2. Check if database tables already exist (e.g. users table)
                boolean tablesExist = false;
                try (java.sql.Connection conn = dynamicDs.getConnection()) {
                    java.sql.ResultSet rs = conn.getMetaData().getTables(null, null, "users", null);
                    if (rs.next()) {
                        tablesExist = true;
                    }
                } catch (Exception connEx) {
                    System.err.println("Could not check metadata for users table: " + connEx.getMessage());
                }

                // 3. If tables do not exist, run SchemaManager.create(true)
                if (!tablesExist) {
                    System.out.println("No 'users' table found. Programmatically initializing database schema...");
                    try {
                        org.hibernate.SessionFactory sessionFactory = entityManagerFactory.unwrap(org.hibernate.SessionFactory.class);
                        sessionFactory.getSchemaManager().create(true);
                        System.out.println("Programmatic schema initialization completed successfully.");
                    } catch (Exception schemaEx) {
                        System.err.println("Failed to programmatically initialize schema: " + schemaEx.getMessage());
                        schemaEx.printStackTrace();
                    }
                } else {
                    System.out.println("Database schema already exists. Skipping schema creation.");
                }

                // 4. Run the database seeder to populate default configurations and admin users
                try {
                    System.out.println("Running DatabaseSeeder on the newly switched database...");
                    databaseSeeder.run();
                    System.out.println("DatabaseSeeder execution finished successfully on the new database.");
                } catch (Exception seederEx) {
                    System.err.println("Failed to seed the newly switched database: " + seederEx.getMessage());
                    seederEx.printStackTrace();
                }
            } catch (Exception e) {
                System.err.println("Failed to dynamically switch datasource to " + connectionUrl + ": " + e.getMessage());
            }
        }
    }

    private void deactivateAll() {
        List<NeonDatabase> list = repository.findAll();
        for (NeonDatabase db : list) {
            if (db.isActive()) {
                db.setActive(false);
                repository.save(db);
            }
        }
    }
}
