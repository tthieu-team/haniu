package com.haniu.tthieu.haniu.service.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@Service
@Primary
public class CloudinaryStorageServiceImpl implements StorageService {

    @Value("${CLOUDINARY_CLOUD_NAME}")
    private String cloudName;

    @Value("${CLOUDINARY_API_KEY}")
    private String apiKey;

    @Value("${CLOUDINARY_API_SECRET}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret,
            "secure", true
        ));
    }

    @Override
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file to Cloudinary", e);
        }
    }

    @Override
    public void delete(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        try {
            String publicId = extractPublicId(fileUrl);
            if (publicId != null && !publicId.isEmpty()) {
                String resourceType = "image";
                if (fileUrl.contains("/video/")) {
                    resourceType = "video";
                } else if (fileUrl.contains("/raw/")) {
                    resourceType = "raw";
                }
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
            }
        } catch (IOException e) {
            // Log error but do not block primary flow
        }
    }

    private String extractPublicId(String url) {
        try {
            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1) return null;
            
            String pathAfterUpload = url.substring(uploadIndex + 8);
            if (pathAfterUpload.startsWith("v")) {
                int firstSlash = pathAfterUpload.indexOf("/");
                if (firstSlash != -1) {
                    pathAfterUpload = pathAfterUpload.substring(firstSlash + 1);
                }
            }
            
            int lastDot = pathAfterUpload.lastIndexOf(".");
            if (lastDot != -1) {
                pathAfterUpload = pathAfterUpload.substring(0, lastDot);
            }
            return pathAfterUpload;
        } catch (Exception e) {
            return null;
        }
    }
}
