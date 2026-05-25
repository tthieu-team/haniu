package com.haniu.tthieu.haniu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		loadEnv();
		normalizeEnv();
		SpringApplication.run(Application.class, args);
	}

	private static void normalizeEnv() {
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

		if (dbUrl != null) {
			dbUrl = dbUrl.trim();
			if (dbUrl.startsWith("\"") && dbUrl.endsWith("\"")) {
				dbUrl = dbUrl.substring(1, dbUrl.length() - 1);
			} else if (dbUrl.startsWith("'") && dbUrl.endsWith("'")) {
				dbUrl = dbUrl.substring(1, dbUrl.length() - 1);
			}
			
			String cleanUrl = dbUrl;
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
					String username = colonIdx != -1 ? credentials.substring(0, colonIdx) : credentials;
					String password = colonIdx != -1 ? credentials.substring(colonIdx + 1) : "";
					
					System.setProperty("spring.datasource.username", username);
					System.setProperty("spring.datasource.password", password);
					
					dbUrl = "jdbc:postgresql://" + hostDb;
				} else {
					dbUrl = "jdbc:postgresql://" + remainder;
				}
			}
			System.setProperty("DATABASE_URL_POSTGRE", dbUrl);
			System.out.println("Normalized database connection URL: " + dbUrl);
		}
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
