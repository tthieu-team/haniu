package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final StorageService storageService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = storageService.store(file);
        return ResponseEntity.ok(Map.of(
            "url", fileUrl,
            "name", file.getOriginalFilename()
        ));
    }

    @PostMapping("/products/images")
    public ResponseEntity<Map<String, String>> uploadProductImage(@RequestParam("file") MultipartFile file) {
        String fileUrl = storageService.store(file, "products/images");
        return ResponseEntity.ok(Map.of(
            "url", fileUrl,
            "name", file.getOriginalFilename()
        ));
    }

    @PostMapping("/products/videos")
    public ResponseEntity<Map<String, String>> uploadProductVideo(@RequestParam("file") MultipartFile file) {
        String fileUrl = storageService.store(file, "products/videos");
        return ResponseEntity.ok(Map.of(
            "url", fileUrl,
            "name", file.getOriginalFilename()
        ));
    }

    @GetMapping("/files/**")
    public ResponseEntity<Resource> serveFile(HttpServletRequest request) {
        try {
            String uri = request.getRequestURI();
            String path = uri.split("/api/v1/uploads/files/")[1];
            Path file = Paths.get(uploadDir).resolve(path).normalize().toAbsolutePath();

            // Security check
            Path absoluteUploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!file.startsWith(absoluteUploadDir)) {
                return ResponseEntity.badRequest().build();
            }

            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteFile(@RequestParam("url") String url) {
        storageService.delete(url);
        return ResponseEntity.ok(Map.of("message", "Xóa file thành công"));
    }
}
