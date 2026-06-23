package com.haniu.tthieu.haniu.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.haniu.tthieu.haniu.config.DatabaseConfig;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManagerFactory;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DatabaseBackupService {

    private static final String BACKUP_ROOT = "d:/FullStack/haniu/db_backups";
    private final ObjectMapper objectMapper;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private com.haniu.tthieu.haniu.config.DatabaseSeeder databaseSeeder;

    public DatabaseBackupService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    public static class BackupMetadata {
        public String name;
        public String timestamp;
        public String sourceUrl;
        public int totalTables;
        public long totalRows;
        public String createdAt;
        public List<String> tables;
    }

    public BackupMetadata createBackup(String dbName, String connectionUrl) throws Exception {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
        String backupDirName = "backup_" + dbName.replaceAll("[^a-zA-Z0-9_-]", "_") + "_" + timestamp;
        File backupDir = new File(BACKUP_ROOT, backupDirName);
        if (!backupDir.exists()) {
            backupDir.mkdirs();
        }

        var dbInfo = new DatabaseConfig.DbConnectionInfo(connectionUrl);
        Properties props = new Properties();
        if (dbInfo.username != null) props.setProperty("user", dbInfo.username);
        if (dbInfo.password != null) props.setProperty("password", dbInfo.password);

        List<String> tables = new ArrayList<>();
        long totalRows = 0;

        try (Connection conn = DriverManager.getConnection(dbInfo.jdbcUrl, props)) {
            // Get all public tables
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'")) {
                while (rs.next()) {
                    tables.add(rs.getString("table_name"));
                }
            }

            for (String table : tables) {
                List<Map<String, Object>> rows = new ArrayList<>();
                String selectSql = "SELECT * FROM " + table;
                try (Statement stmt = conn.createStatement();
                     ResultSet rs = stmt.executeQuery(selectSql)) {
                    ResultSetMetaData meta = rs.getMetaData();
                    int colCount = meta.getColumnCount();

                    while (rs.next()) {
                        Map<String, Object> row = new LinkedHashMap<>();
                        for (int i = 1; i <= colCount; i++) {
                            String colName = meta.getColumnName(i);
                            Object val = rs.getObject(i);
                            if (val != null) {
                                if (val instanceof java.sql.Array) {
                                    val = ((java.sql.Array) val).getArray();
                                } else {
                                    String className = val.getClass().getName();
                                    if (className.startsWith("org.postgresql.util.PGobject")) {
                                        val = val.toString();
                                    } else if (val instanceof java.sql.Timestamp) {
                                        val = val.toString();
                                    } else if (val instanceof java.sql.Date) {
                                        val = val.toString();
                                    } else if (val instanceof java.sql.Time) {
                                        val = val.toString();
                                    } else if (val instanceof java.util.UUID) {
                                        val = val.toString();
                                    }
                                }
                            }
                            row.put(colName, val);
                        }
                        rows.add(row);
                    }
                }
                
                totalRows += rows.size();
                File tableFile = new File(backupDir, table + ".json");
                objectMapper.writeValue(tableFile, rows);
            }
        }

        BackupMetadata meta = new BackupMetadata();
        meta.name = backupDirName;
        meta.timestamp = timestamp;
        meta.sourceUrl = connectionUrl;
        meta.totalTables = tables.size();
        meta.totalRows = totalRows;
        meta.createdAt = LocalDateTime.now().toString();
        meta.tables = tables;

        objectMapper.writeValue(new File(backupDir, "_metadata.json"), meta);
        return meta;
    }

    public List<BackupMetadata> listBackups() {
        File root = new File(BACKUP_ROOT);
        if (!root.exists() || !root.isDirectory()) {
            return Collections.emptyList();
        }

        File[] dirs = root.listFiles(File::isDirectory);
        if (dirs == null) {
            return Collections.emptyList();
        }

        List<BackupMetadata> list = new ArrayList<>();
        for (File dir : dirs) {
            File metaFile = new File(dir, "_metadata.json");
            if (metaFile.exists()) {
                try {
                    BackupMetadata meta = objectMapper.readValue(metaFile, BackupMetadata.class);
                    list.add(meta);
                } catch (IOException e) {
                    BackupMetadata meta = new BackupMetadata();
                    meta.name = dir.getName();
                    meta.createdAt = new java.util.Date(dir.lastModified()).toString();
                    list.add(meta);
                }
            }
        }
        list.sort((a, b) -> b.name.compareTo(a.name));
        return list;
    }

    public void deleteBackup(String backupName) {
        File dir = new File(BACKUP_ROOT, backupName);
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File f : files) {
                    f.delete();
                }
            }
            dir.delete();
        }
    }

    public void restoreBackup(String backupName, String targetUrl) throws Exception {
        File backupDir = new File(BACKUP_ROOT, backupName);
        if (!backupDir.exists() || !backupDir.isDirectory()) {
            throw new FileNotFoundException("Không tìm thấy thư mục backup: " + backupName);
        }

        File metaFile = new File(backupDir, "_metadata.json");
        BackupMetadata meta = objectMapper.readValue(metaFile, BackupMetadata.class);

        var targetInfo = new DatabaseConfig.DbConnectionInfo(targetUrl);
        Properties props = new Properties();
        if (targetInfo.username != null) props.setProperty("user", targetInfo.username);
        if (targetInfo.password != null) props.setProperty("password", targetInfo.password);

        try (Connection destConn = DriverManager.getConnection(targetInfo.jdbcUrl, props)) {
            destConn.setAutoCommit(false);

            // 1. Fetch and drop all public tables in destination
            List<String> targetTables = new ArrayList<>();
            try {
                DatabaseMetaData dbmd = destConn.getMetaData();
                try (ResultSet rs = dbmd.getTables(null, null, null, new String[]{"TABLE"})) {
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

            try (Statement destStmt = destConn.createStatement()) {
                for (String table : targetTables) {
                    try {
                        destStmt.execute("DROP TABLE IF EXISTS " + table + " CASCADE");
                    } catch (Exception e) {
                        System.err.println("Failed to drop table " + table + ": " + e.getMessage());
                    }
                }
                destConn.commit();
            }

            // 2. Re-create schema using Hibernate
            try {
                SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
                var dynamicDs = DatabaseConfig.getDynamicDataSourceInstance();
                dynamicDs.switchDataSource(targetUrl);
                sessionFactory.getSchemaManager().create(true);
                System.out.println("Target schema re-created successfully.");
            } catch (Exception schemaEx) {
                System.err.println("Failed to initialize target schema: " + schemaEx.getMessage());
            }

            // 3. Import data from backup files using retry queue for foreign keys
            List<String> queue = new ArrayList<>(meta.tables);
            int lastQueueSize = -1;
            int consecutiveFailures = 0;
            Map<String, Exception> tableErrors = new HashMap<>();

            while (!queue.isEmpty()) {
                if (queue.size() == lastQueueSize) {
                    consecutiveFailures++;
                    if (consecutiveFailures > 3) {
                        String failedTables = String.join(", ", queue);
                        Exception firstError = tableErrors.get(queue.get(0));
                        throw new RuntimeException("Cannot resolve foreign key dependencies for: [" + failedTables + "]", firstError);
                    }
                } else {
                    lastQueueSize = queue.size();
                    consecutiveFailures = 0;
                }

                String table = queue.remove(0);
                File tableFile = new File(backupDir, table + ".json");
                if (!tableFile.exists()) {
                    continue;
                }

                List<Map<String, Object>> rows = objectMapper.readValue(tableFile, List.class);
                if (rows.isEmpty()) {
                    continue;
                }

                // Query target table column types using JDBC to dynamically map PGobjects / UUIDs
                Map<String, String> colTypes = new HashMap<>();
                try {
                    DatabaseMetaData dbmd = destConn.getMetaData();
                    try (ResultSet rsCols = dbmd.getColumns(null, "public", table, null)) {
                        while (rsCols.next()) {
                            colTypes.put(rsCols.getString("COLUMN_NAME").toLowerCase(), rsCols.getString("TYPE_NAME").toLowerCase());
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Failed to fetch column metadata for: " + table + ", " + e.getMessage());
                }

                Map<String, Object> firstRow = rows.get(0);
                StringBuilder insertSql = new StringBuilder("INSERT INTO " + table + " (");
                StringBuilder valuesPart = new StringBuilder("VALUES (");
                List<String> cols = new ArrayList<>(firstRow.keySet());
                for (int i = 0; i < cols.size(); i++) {
                    insertSql.append(cols.get(i));
                    valuesPart.append("?");
                    if (i < cols.size() - 1) {
                        insertSql.append(", ");
                        valuesPart.append(", ");
                    }
                }
                insertSql.append(") ").append(valuesPart).append(")");

                try (PreparedStatement pstmt = destConn.prepareStatement(insertSql.toString())) {
                    for (Map<String, Object> row : rows) {
                        for (int i = 0; i < cols.size(); i++) {
                            String col = cols.get(i);
                            Object val = row.get(col);
                            String type = colTypes.get(col.toLowerCase());
                            if (val == null) {
                                pstmt.setNull(i + 1, java.sql.Types.NULL);
                            } else if (type != null && type.contains("uuid")) {
                                pstmt.setObject(i + 1, java.util.UUID.fromString(val.toString()));
                            } else if (type != null && (type.contains("json") || type.contains("jsonb"))) {
                                pstmt.setObject(i + 1, val.toString(), java.sql.Types.OTHER);
                            } else if (type != null && (type.startsWith("_") || type.contains("array"))) {
                                String elementTypeName = type.startsWith("_") ? type.substring(1) : type.replace("[]", "");
                                Object[] arr;
                                if (val instanceof List) {
                                    arr = ((List<?>) val).toArray();
                                } else if (val instanceof Object[]) {
                                    arr = (Object[]) val;
                                } else {
                                    arr = new Object[]{val};
                                }
                                java.sql.Array sqlArr = destConn.createArrayOf(elementTypeName, arr);
                                pstmt.setArray(i + 1, sqlArr);
                            } else {
                                pstmt.setObject(i + 1, val);
                            }
                        }
                        pstmt.addBatch();
                    }
                    pstmt.executeBatch();
                    destConn.commit();
                    tableErrors.remove(table);
                } catch (Exception ex) {
                    destConn.rollback();
                    String sqlState = "";
                    if (ex instanceof SQLException) {
                        sqlState = ((SQLException) ex).getSQLState();
                    }
                    if ("23503".equals(sqlState)) {
                        queue.add(table);
                        tableErrors.put(table, ex);
                    } else {
                        throw ex;
                    }
                }
            }

            // 4. Reset sequences
            try (Statement destStmt = destConn.createStatement()) {
                for (String table : meta.tables) {
                    try {
                        destStmt.execute("SELECT setval(pg_get_serial_sequence('" + table + "', 'id'), coalesce(max(id), 1)) FROM " + table);
                    } catch (Exception seqEx) {
                        // Ignore
                    }
                }
                destConn.commit();
            }

            // 5. Seed default configs & admin users
            try {
                var dynamicDs = DatabaseConfig.getDynamicDataSourceInstance();
                dynamicDs.switchDataSource(targetUrl);
                databaseSeeder.run();
            } catch (Exception seederEx) {
                System.err.println("Failed to seed after restore: " + seederEx.getMessage());
            }
        }
    }
}
