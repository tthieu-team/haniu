package com.haniu.tthieu.haniu.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalStorageServiceImpl implements StorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        try {
            this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        return store(file, "");
    }

    @Override
    public String store(MultipartFile file, String subfolder) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.rootLocation;
            if (subfolder != null && !subfolder.isEmpty()) {
                targetLocation = this.rootLocation.resolve(subfolder).normalize();
                Files.createDirectories(targetLocation);
            }

            Path destinationFile = targetLocation.resolve(Paths.get(newFilename))
                    .normalize().toAbsolutePath();

            if (!destinationFile.startsWith(this.rootLocation.toAbsolutePath())) {
                // Security check
                throw new RuntimeException("Cannot store file outside current directory.");
            }

            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // Return relative URL with forward slashes for the controller mapping
            String relativeUrlPath = (subfolder != null && !subfolder.isEmpty()) ? (subfolder + "/" + newFilename) : newFilename;
            return "/api/v1/uploads/files/" + relativeUrlPath.replace("\\", "/");
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    @Override
    public void delete(String fileUrl) {
        try {
            if (fileUrl == null || !fileUrl.contains("/api/v1/uploads/files/")) {
                return;
            }
            String relativePath = fileUrl.substring(fileUrl.indexOf("/api/v1/uploads/files/") + "/api/v1/uploads/files/".length());
            Path file = this.rootLocation.resolve(relativePath).normalize().toAbsolutePath();
            if (file.startsWith(this.rootLocation.toAbsolutePath())) {
                Files.deleteIfExists(file);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file.", e);
        }
    }
}
