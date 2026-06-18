package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.system.NeonDatabase;
import com.haniu.tthieu.haniu.repository.NeonDatabaseRepository;
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
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa cấu hình database thành công"));
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
            copyDataBetweenDatabases(oldUrl, nextActive.getConnectionUrl());
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
    public ResponseEntity<Map<String, Object>> syncCurrent() {
        List<NeonDatabase> list = repository.findAllByOrderBySortOrderAsc();
        NeonDatabase currentActive = list.stream()
                .filter(NeonDatabase::isActive)
                .findFirst()
                .orElse(null);

        String connectionUrl = null;
        if (currentActive != null) {
            connectionUrl = currentActive.getConnectionUrl();
        } else {
            // Fallback to bootstrap connection URL
            connectionUrl = System.getProperty("DATABASE_URL_POSTGRE");
            if (connectionUrl == null) {
                connectionUrl = System.getenv("DATABASE_URL_POSTGRE");
            }
        }

        if (connectionUrl == null || connectionUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy URL kết nối database đang hoạt động"));
        }

        // Fetch source connection URL (usually local db URL) to copy from
        String sourceUrl = System.getProperty("DATABASE_URL_LOCAL");
        if (sourceUrl == null) {
            sourceUrl = System.getenv("DATABASE_URL_LOCAL");
        }
        if (sourceUrl == null) {
            sourceUrl = System.getProperty("DATABASE_URL_POSTGRE");
            if (sourceUrl == null) {
                sourceUrl = System.getenv("DATABASE_URL_POSTGRE");
            }
        }

        // Copy all data from source database (local) to the active database (Neon)
        if (sourceUrl != null && !sourceUrl.equals(connectionUrl)) {
            copyDataBetweenDatabases(sourceUrl, connectionUrl);
        }

        triggerRotationIfProduction(connectionUrl);

        return ResponseEntity.ok(Map.of(
            "message", "Đồng bộ cấu trúc bảng và toàn bộ dữ liệu thành công lên database đang hoạt động!",
            "activeDb", currentActive != null ? currentActive.getName() : "Local/Mặc định",
            "connectionUrl", connectionUrl
        ));
    }

    private void copyDataBetweenDatabases(String sourceUrl, String targetUrl) {
        if (sourceUrl == null || targetUrl == null || sourceUrl.trim().equals(targetUrl.trim())) {
            return;
        }

        System.out.println(">>> [DB Rotation] Starting data copy from: " + sourceUrl + " to: " + targetUrl);
        var sourceInfo = new com.haniu.tthieu.haniu.config.DatabaseConfig.DbConnectionInfo(sourceUrl);
        var targetInfo = new com.haniu.tthieu.haniu.config.DatabaseConfig.DbConnectionInfo(targetUrl);

        String[] tables = {
            "system_configurations", "translation_caches", "brands", "collections",
            "attribute_definitions", "categories", "occasions", "recipients",
            "products", "product_variants", "product_medias", "product_attributes",
            "product_occasions", "product_recipients", "carts", "cart_items",
            "users", "orders", "order_items", "reviews", "testimonials",
            "posts", "stories", "ugc_items", "neon_databases"
        };

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

            // 1. Create target tables if they do not exist
            boolean tablesExist = false;
            try {
                java.sql.DatabaseMetaData dbmd = destConn.getMetaData();
                try (java.sql.ResultSet rs = dbmd.getTables(null, null, "users", null)) {
                    if (rs.next()) {
                        tablesExist = true;
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to verify target tables existence: " + e.getMessage());
            }

            if (!tablesExist) {
                System.out.println(">>> [DB Rotation] Creating database schema on target database first...");
                try {
                    org.hibernate.SessionFactory sessionFactory = entityManagerFactory.unwrap(org.hibernate.SessionFactory.class);
                    // Temporarily set active connection to target to initialize it
                    var dynamicDs = com.haniu.tthieu.haniu.config.DatabaseConfig.getDynamicDataSourceInstance();
                    dynamicDs.switchDataSource(targetUrl);
                    sessionFactory.getSchemaManager().create(true);
                    // Revert connection to source for copying
                    dynamicDs.switchDataSource(sourceUrl);
                    System.out.println(">>> [DB Rotation] Target schema created successfully.");
                } catch (Exception schemaEx) {
                    System.err.println("Failed to initialize target schema: " + schemaEx.getMessage());
                }
            }

            // 2. Truncate target tables to ensure clean copy
            try (java.sql.Statement destStmt = destConn.createStatement()) {
                System.out.println(">>> [DB Rotation] Truncating target tables...");
                destStmt.execute("TRUNCATE TABLE reviews, order_items, orders, cart_items, carts, product_variants, products, categories, occasions, recipients, testimonials, posts, stories, ugc_items, product_medias, product_attributes, brands, collections, attribute_definitions, system_configurations, translation_caches, product_occasions, product_recipients, neon_databases CASCADE");
                destConn.commit();
            } catch (Exception truncateEx) {
                System.err.println("Failed to truncate target tables: " + truncateEx.getMessage());
            }

            // 3. Copy row by row for each table
            for (String table : tables) {
                // Verify source table exists
                try {
                    java.sql.DatabaseMetaData dbmd = srcConn.getMetaData();
                    try (java.sql.ResultSet rs = dbmd.getTables(null, null, table, null)) {
                        if (!rs.next()) {
                            continue;
                        }
                    }
                } catch (Exception e) {
                    // Ignore metadata error and proceed
                }

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
                    }
                } catch (Exception tableEx) {
                    System.err.println("Failed to copy table " + table + ": " + tableEx.getMessage());
                    destConn.rollback();
                }
            }

            // 4. Reset sequences for tables with serial/numeric primary keys
            try (java.sql.Statement destStmt = destConn.createStatement()) {
                String[] tablesWithSerial = {"orders", "order_items", "translation_caches", "reviews"};
                for (String table : tablesWithSerial) {
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
