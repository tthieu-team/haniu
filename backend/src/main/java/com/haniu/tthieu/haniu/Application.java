package com.haniu.tthieu.haniu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import java.io.File;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableAsync
@EnableCaching
public class Application {

	public static void main(String[] args) {
		loadEnv();
		normalizeEnv();
		SpringApplication.run(Application.class, args);
	}

	private static void normalizeEnv() {
		String useLocalDb = System.getProperty("USE_LOCAL_DB");
		if (useLocalDb == null) {
			useLocalDb = System.getenv("USE_LOCAL_DB");
		}
		
		String dbUrl = null;
		if ("true".equalsIgnoreCase(useLocalDb)) {
			dbUrl = System.getProperty("DATABASE_URL_LOCAL");
			if (dbUrl == null) {
				dbUrl = System.getenv("DATABASE_URL_LOCAL");
			}
			System.out.println("Using Local Database as requested (USE_LOCAL_DB=true)");
		} else {
			dbUrl = System.getProperty("DATABASE_URL_NEON");
			if (dbUrl == null) {
				dbUrl = System.getenv("DATABASE_URL_NEON");
			}
			if (dbUrl != null) {
				System.out.println("Using Neon Database as requested (USE_LOCAL_DB=false)");
				String activeRotatedUrl = fetchActiveNeonDbUrl(dbUrl);
				if (activeRotatedUrl != null) {
					dbUrl = activeRotatedUrl;
				}
			}
		}

		if (dbUrl == null) {
			dbUrl = System.getProperty("DATABASE_URL_POSTGRE");
			if (dbUrl == null) {
				dbUrl = System.getenv("DATABASE_URL_POSTGRE");
			}
		}
		if (dbUrl == null) {
			dbUrl = System.getProperty("DATABASE_URL");
		}
		if (dbUrl == null) {
			dbUrl = System.getenv("DATABASE_URL");
		}

		if (dbUrl != null) {
			dbUrl = dbUrl.trim();
			if (dbUrl.startsWith("\"") && dbUrl.endsWith("\"")) {
				dbUrl = dbUrl.substring(1, dbUrl.length() - 1);
			} else if (dbUrl.startsWith("'") && dbUrl.endsWith("'")) {
				dbUrl = dbUrl.substring(1, dbUrl.length() - 1);
			}
			System.setProperty("DATABASE_URL_POSTGRE", dbUrl);
			System.out.println("Normalized database connection URL: " + dbUrl);
		}
	}

	private static String fetchActiveNeonDbUrl(String bootstrapUrl) {
		if (bootstrapUrl == null) {
			return null;
		}
		try {
			com.haniu.tthieu.haniu.config.DatabaseConfig.DbConnectionInfo info = 
				new com.haniu.tthieu.haniu.config.DatabaseConfig.DbConnectionInfo(bootstrapUrl);
			
			Class.forName("org.postgresql.Driver");
			
			java.util.Properties props = new java.util.Properties();
			if (info.username != null) {
				props.setProperty("user", info.username);
			}
			if (info.password != null) {
				props.setProperty("password", info.password);
			}
			props.setProperty("connectTimeout", "5");
			
			try (java.sql.Connection conn = java.sql.DriverManager.getConnection(info.jdbcUrl, props);
				 java.sql.Statement stmt = conn.createStatement()) {
				
				java.sql.ResultSet tables = conn.getMetaData().getTables(null, null, "neon_databases", null);
				if (tables.next()) {
					try (java.sql.ResultSet rs = stmt.executeQuery("SELECT connection_url FROM neon_databases WHERE is_active = true LIMIT 1")) {
						if (rs.next()) {
							String activeUrl = rs.getString("connection_url");
							if (activeUrl != null && !activeUrl.trim().isEmpty()) {
								System.out.println("Found active rotated database URL from neon_databases: " + activeUrl);
								return activeUrl;
							}
						}
					}
				} else {
					System.out.println("Table neon_databases not found in bootstrap database.");
				}
			}
		} catch (Exception e) {
			System.out.println("Could not fetch active rotated database URL from bootstrap database (table might not exist yet or connection failed): " + e.getMessage());
		}
		return null;
	}


	private static void loadEnv() {
		File envFile = null;
		File localEnv = new File(".env");
		File backendEnv = new File("backend/.env");

		if (backendEnv.exists()) {
			envFile = backendEnv;
			System.out.println("Loading environment from: " + envFile.getAbsolutePath());
		} else if (localEnv.exists() && new File("src/main/java").exists()) {
			envFile = localEnv;
			System.out.println("Loading environment from: " + envFile.getAbsolutePath());
		}

		if (envFile != null && envFile.exists()) {
			try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
				String line;
				while ((line = reader.readLine()) != null) {
					line = line.trim();
					if (line.isEmpty() || line.startsWith("#")) {
						continue;
					}
					int eqIdx = line.indexOf('=');
					if (eqIdx > 0) {
						String key = line.substring(0, eqIdx).trim();
						String value = line.substring(eqIdx + 1).trim();
						if (value.startsWith("\"") && value.endsWith("\"")) {
							value = value.substring(1, value.length() - 1);
						} else if (value.startsWith("'") && value.endsWith("'")) {
							value = value.substring(1, value.length() - 1);
						}
						// Set the system property so Spring Boot can resolve it
						System.setProperty(key, value);
					}
				}
			} catch (IOException e) {
				System.err.println("Failed to load local .env file: " + e.getMessage());
			}
		} else {
			System.out.println("No backend .env file found to load. Relying on system environment.");
		}
	}
}
