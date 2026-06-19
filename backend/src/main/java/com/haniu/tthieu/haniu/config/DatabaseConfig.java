package com.haniu.tthieu.haniu.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DelegatingDataSource;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    private static DynamicDataSource dynamicDataSourceInstance;
    private static String currentActiveUrl;

    public static String getCurrentActiveUrl() {
        return currentActiveUrl;
    }

    public static class DbConnectionInfo {
        public String jdbcUrl;
        public String username;
        public String password;

        public DbConnectionInfo(String rawUrl) {
            String cleanUrl = rawUrl.trim();
            if (cleanUrl.startsWith("\"") && cleanUrl.endsWith("\"")) {
                cleanUrl = cleanUrl.substring(1, cleanUrl.length() - 1);
            } else if (cleanUrl.startsWith("'") && cleanUrl.endsWith("'")) {
                cleanUrl = cleanUrl.substring(1, cleanUrl.length() - 1);
            }

            if (cleanUrl.startsWith("jdbc:")) {
                cleanUrl = cleanUrl.substring(5);
            }

            if (cleanUrl.startsWith("postgresql://") || cleanUrl.startsWith("postgres://")) {
                int schemeIdx = cleanUrl.indexOf("://");
                String remainder = cleanUrl.substring(schemeIdx + 3);
                int atIdx = remainder.lastIndexOf('@');
                if (atIdx != -1) {
                    String credentials = remainder.substring(0, atIdx);
                    String hostDb = remainder.substring(atIdx + 1);

                    int colonIdx = credentials.indexOf(':');
                    this.username = colonIdx != -1 ? credentials.substring(0, colonIdx) : credentials;
                    this.password = colonIdx != -1 ? credentials.substring(colonIdx + 1) : "";
                    this.jdbcUrl = "jdbc:postgresql://" + hostDb;
                } else {
                    this.jdbcUrl = "jdbc:postgresql://" + remainder;
                }
            } else {
                this.jdbcUrl = rawUrl;
            }
        }
    }

    public static class DynamicDataSource extends DelegatingDataSource {
        private final java.util.Map<String, HikariDataSource> dataSourceCache = new java.util.concurrent.ConcurrentHashMap<>();
        private HikariDataSource currentHikariDataSource;

        public DynamicDataSource(DataSource initialDataSource) {
            super(initialDataSource);
            if (initialDataSource instanceof HikariDataSource) {
                this.currentHikariDataSource = (HikariDataSource) initialDataSource;
            }
        }

        public synchronized void switchDataSource(String newRawUrl) {
            System.out.println("Switching database connection URL to: " + newRawUrl);
            currentActiveUrl = newRawUrl;
            
            HikariDataSource newDs = dataSourceCache.get(newRawUrl);
            if (newDs == null) {
                DbConnectionInfo info = new DbConnectionInfo(newRawUrl);

                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(info.jdbcUrl);
                if (info.username != null) {
                    config.setUsername(info.username);
                }
                if (info.password != null) {
                    config.setPassword(info.password);
                }
                config.setDriverClassName("org.postgresql.Driver");

                // Copy key HikariCP pool optimizations
                config.setMaximumPoolSize(10);
                config.setMinimumIdle(5);
                config.setIdleTimeout(300000);
                config.setMaxLifetime(1800000);
                config.setConnectionTimeout(20000);

                newDs = new HikariDataSource(config);
                dataSourceCache.put(newRawUrl, newDs);
            }

            // Set the target data source
            setTargetDataSource(newDs);
            afterPropertiesSet();

            this.currentHikariDataSource = newDs;
        }

        public void cacheDataSource(String url, HikariDataSource ds) {
            dataSourceCache.put(url, ds);
        }
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        // Build initial datasource based on environment properties
        String dbUrl = System.getProperty("DATABASE_URL_POSTGRE");
        if (dbUrl == null) {
            dbUrl = System.getenv("DATABASE_URL_POSTGRE");
        }
        if (dbUrl == null) {
            dbUrl = System.getProperty("DATABASE_URL");
        }
        if (dbUrl == null) {
            dbUrl = System.getenv("DATABASE_URL");
        }

        DbConnectionInfo info = new DbConnectionInfo(dbUrl);
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(info.jdbcUrl);
        if (info.username != null) {
            config.setUsername(info.username);
        }
        if (info.password != null) {
            config.setPassword(info.password);
        }
        config.setDriverClassName("org.postgresql.Driver");

        // Copy key HikariCP pool optimizations
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setIdleTimeout(300000);
        config.setMaxLifetime(1800000);
        config.setConnectionTimeout(20000);

        HikariDataSource initialDs = new HikariDataSource(config);
        currentActiveUrl = dbUrl;
        DynamicDataSource dynamicDs = new DynamicDataSource(initialDs);
        dynamicDs.cacheDataSource(dbUrl, initialDs);
        dynamicDataSourceInstance = dynamicDs;

        return dynamicDs;
    }

    public static DynamicDataSource getDynamicDataSourceInstance() {
        return dynamicDataSourceInstance;
    }
}
