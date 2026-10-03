package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.photobooth.*;
import com.haniu.tthieu.haniu.entity.system.SystemConfig;
import com.haniu.tthieu.haniu.repository.*;
import com.haniu.tthieu.haniu.service.SystemConfigService;
import com.haniu.tthieu.haniu.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;

@RestController
@RequestMapping("/api/v1/photobooth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PhotoboothController {

    private final PhotoboothEventRepository eventRepository;
    private final PhotoboothTemplateRepository templateRepository;
    private final PhotoboothAssetRepository assetRepository;
    private final PhotoboothSessionRepository sessionRepository;
    private final SystemConfigService systemConfigService;
    private final StorageService storageService;
    private final JdbcTemplate jdbcTemplate;

    private static final String SETTINGS_CONFIG_KEY = "photobooth_settings";
    private static final String DEFAULT_SETTINGS_JSON = "{\"countdown\":3,\"isSoundEnabled\":true,\"isFilterEnabled\":true}";

    @PostConstruct
    public void initDatabaseSchema() {
        try {
            // Ensure photobooth_sessions.image_url is TEXT type in PostgreSQL/MySQL/H2
            jdbcTemplate.execute("ALTER TABLE photobooth_sessions ALTER COLUMN image_url TYPE TEXT");
        } catch (Exception e) {
            // Ignore if column is already TEXT or table does not support this exact syntax
        }
    }

    // --- STATS / DASHBOARD ---

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<PhotoboothSession> sessions = sessionRepository.findAll();
        List<PhotoboothEvent> events = eventRepository.findAll();
        List<PhotoboothTemplate> templates = templateRepository.findAll();

        long totalSessions = sessions.size();
        long activeEvents = events.stream().filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus())).count();
        long totalTemplates = templates.size();
        long totalPhotos = sessions.stream()
            .filter(s -> "ORDERED".equalsIgnoreCase(s.getStatus()) || "PRINTED".equalsIgnoreCase(s.getStatus()) || "Completed".equalsIgnoreCase(s.getStatus()))
            .count();

        // Compute sessions by day of week (Monday to Sunday)
        int[] counts = new int[7];
        for (PhotoboothSession sess : sessions) {
            if (sess.getCreatedAt() != null) {
                int day = sess.getCreatedAt().getDayOfWeek().getValue(); // 1: Monday ... 7: Sunday
                counts[day - 1]++;
            }
        }
        List<Map<String, Object>> chartData = List.of(
            Map.of("day", "Thứ 2", "val", counts[0]),
            Map.of("day", "Thứ 3", "val", counts[1]),
            Map.of("day", "Thứ 4", "val", counts[2]),
            Map.of("day", "Thứ 5", "val", counts[3]),
            Map.of("day", "Thứ 6", "val", counts[4]),
            Map.of("day", "Thứ 7", "val", counts[5]),
            Map.of("day", "Chủ Nhật", "val", counts[6])
        );

        // Group and rank templates
        Map<String, Long> templateCounts = new HashMap<>();
        for (PhotoboothSession sess : sessions) {
            String tName = sess.getTemplateName() != null && !sess.getTemplateName().isBlank() ? sess.getTemplateName() : "Bố cục mặc định";
            templateCounts.put(tName, templateCounts.getOrDefault(tName, 0L) + 1);
        }

        List<Map<String, Object>> rankings = new ArrayList<>();
        long total = totalSessions > 0 ? totalSessions : 1;
        templateCounts.entrySet().stream()
            .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
            .forEach(entry -> {
                double rate = (entry.getValue() * 100.0) / total;
                rankings.add(Map.of(
                    "name", entry.getKey(),
                    "count", entry.getValue(),
                    "val", entry.getValue() + " lượt",
                    "rate", String.format(java.util.Locale.US, "%.1f%%", rate)
                ));
            });

        Map<String, Object> result = new HashMap<>();
        result.put("totalSessions", totalSessions);
        result.put("activeEvents", activeEvents);
        result.put("totalTemplates", totalTemplates);
        result.put("totalPhotos", totalPhotos);
        result.put("chartData", chartData);
        result.put("templateRankings", rankings);

        return ResponseEntity.ok(result);
    }

    // --- EVENTS ---

    @GetMapping("/events")
    @org.springframework.cache.annotation.Cacheable("photobooth_events")
    public ResponseEntity<List<PhotoboothEvent>> getEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    @org.springframework.cache.annotation.CacheEvict(value = {"photobooth_events", "photobooth_templates"}, allEntries = true)
    public ResponseEntity<PhotoboothEvent> saveEvent(@RequestBody PhotoboothEvent event) {
        if (event.getId() != null && !eventRepository.existsById(event.getId())) {
            event.setId(null);
        }
        return ResponseEntity.ok(eventRepository.save(event));
    }

    @DeleteMapping("/events/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @org.springframework.cache.annotation.CacheEvict(value = {"photobooth_events", "photobooth_templates"}, allEntries = true)
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- TEMPLATES ---

    @GetMapping("/templates")
    public ResponseEntity<?> getTemplates(
            @RequestParam(name = "cursor", required = false) String cursor,
            @RequestParam(name = "limit", required = false) Integer limit,
            @RequestParam(name = "status", required = false) String status
    ) {
        // If limit is not specified, return full list (backwards-compatible)
        if (limit == null || limit <= 0) {
            if (status != null && !status.isBlank()) {
                return ResponseEntity.ok(templateRepository.findAll().stream()
                    .filter(t -> status.equalsIgnoreCase(t.getStatus()))
                    .toList());
            }
            return ResponseEntity.ok(templateRepository.findAll());
        }

        int pageSize = Math.min(limit, 50);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, pageSize + 1);

        List<PhotoboothTemplate> items;
        if (cursor == null || cursor.isBlank()) {
            if (status != null && !status.isBlank()) {
                items = templateRepository.findInitialByStatus(status, pageable);
            } else {
                items = templateRepository.findInitial(pageable);
            }
        } else {
            try {
                String[] parts = cursor.split("__");
                java.time.LocalDateTime cursorTime = java.time.LocalDateTime.parse(parts[0]);
                UUID cursorId = UUID.fromString(parts[1]);
                if (status != null && !status.isBlank()) {
                    items = templateRepository.findNextCursorByStatus(status, cursorTime, cursorId, pageable);
                } else {
                    items = templateRepository.findNextCursor(cursorTime, cursorId, pageable);
                }
            } catch (Exception e) {
                items = (status != null && !status.isBlank())
                    ? templateRepository.findInitialByStatus(status, pageable)
                    : templateRepository.findInitial(pageable);
            }
        }

        boolean hasMore = items.size() > pageSize;
        List<PhotoboothTemplate> pageItems = hasMore ? items.subList(0, pageSize) : items;

        String nextCursor = null;
        if (hasMore && !pageItems.isEmpty()) {
            PhotoboothTemplate last = pageItems.get(pageItems.size() - 1);
            if (last.getCreatedAt() != null && last.getId() != null) {
                nextCursor = last.getCreatedAt().toString() + "__" + last.getId().toString();
            }
        }

        long total = templateRepository.count();

        Map<String, Object> response = new HashMap<>();
        response.put("items", pageItems);
        response.put("nextCursor", nextCursor);
        response.put("hasMore", hasMore);
        response.put("total", total);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    @org.springframework.cache.annotation.CacheEvict(value = "photobooth_templates", allEntries = true)
    public ResponseEntity<PhotoboothTemplate> saveTemplate(@RequestBody PhotoboothTemplate template) {
        if (template.getId() != null && !templateRepository.existsById(template.getId())) {
            template.setId(null);
        }
        return ResponseEntity.ok(templateRepository.save(template));
    }

    @DeleteMapping("/templates/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @org.springframework.cache.annotation.CacheEvict(value = "photobooth_templates", allEntries = true)
    public ResponseEntity<Void> deleteTemplate(@PathVariable UUID id) {
        templateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- ASSETS ---

    @GetMapping("/assets")
    public ResponseEntity<Map<String, List<PhotoboothAsset>>> getAssets() {
        Map<String, List<PhotoboothAsset>> assetsMap = new HashMap<>();
        assetsMap.put("backgrounds", assetRepository.findByType("backgrounds"));
        assetsMap.put("stickers", assetRepository.findByType("stickers"));
        assetsMap.put("logos", assetRepository.findByType("logos"));
        return ResponseEntity.ok(assetsMap);
    }

    @PostMapping("/assets/{type}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoboothAsset> saveAsset(@PathVariable String type, @RequestBody PhotoboothAsset asset) {
        asset.setType(type);
        if (asset.getId() != null && !assetRepository.existsById(asset.getId())) {
            asset.setId(null);
        }
        return ResponseEntity.ok(assetRepository.save(asset));
    }

    @DeleteMapping("/assets/{type}/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAsset(@PathVariable String type, @PathVariable UUID id) {
        Optional<PhotoboothAsset> assetOpt = assetRepository.findById(id);
        if (assetOpt.isPresent()) {
            PhotoboothAsset asset = assetOpt.get();
            try {
                storageService.delete(asset.getUrl());
            } catch (Exception e) {
                // Log exception, keep proceeding to delete from DB
            }
            assetRepository.delete(asset);
        }
        return ResponseEntity.noContent().build();
    }

    // --- SESSIONS ---

    @GetMapping("/sessions")
    public ResponseEntity<List<PhotoboothSession>> getSessions() {
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    @PostMapping("/sessions")
    public ResponseEntity<PhotoboothSession> saveSession(@RequestBody PhotoboothSession session) {
        if (session.getId() != null && !sessionRepository.existsById(session.getId())) {
            session.setId(null);
        }

        // Convert base64 data URL to permanent storage file URL
        if (session.getImageUrl() != null && session.getImageUrl().startsWith("data:image/")) {
            try {
                String base64Data = session.getImageUrl();
                String[] parts = base64Data.split(",");
                if (parts.length > 1) {
                    byte[] imageBytes = Base64.getDecoder().decode(parts[1]);
                    String extension = "png";
                    if (parts[0].contains("jpeg") || parts[0].contains("jpg")) {
                        extension = "jpg";
                    }
                    String filename = "photobooth-" + UUID.randomUUID() + "." + extension;

                    MultipartFile multipartFile = new Base64DecodedMultipartFile(
                        imageBytes,
                        "file",
                        filename,
                        "image/" + (extension.equals("jpg") ? "jpeg" : "png")
                    );
                    String storedUrl = storageService.store(multipartFile, "photobooth");
                    session.setImageUrl(storedUrl);
                }
            } catch (Exception e) {
                // Keep existing base64 string as fallback if storage fails
            }
        }

        return ResponseEntity.ok(sessionRepository.save(session));
    }

    private static class Base64DecodedMultipartFile implements MultipartFile {
        private final byte[] imgContent;
        private final String name;
        private final String originalFilename;
        private final String contentType;

        public Base64DecodedMultipartFile(byte[] imgContent, String name, String originalFilename, String contentType) {
            this.imgContent = imgContent;
            this.name = name;
            this.originalFilename = originalFilename;
            this.contentType = contentType;
        }

        @Override public String getName() { return name; }
        @Override public String getOriginalFilename() { return originalFilename; }
        @Override public String getContentType() { return contentType; }
        @Override public boolean isEmpty() { return imgContent == null || imgContent.length == 0; }
        @Override public long getSize() { return imgContent.length; }
        @Override public byte[] getBytes() { return imgContent; }
        @Override public InputStream getInputStream() { return new ByteArrayInputStream(imgContent); }
        @Override public void transferTo(File dest) throws IOException, IllegalStateException {
            try (FileOutputStream fos = new FileOutputStream(dest)) {
                fos.write(imgContent);
            }
        }
    }

    @DeleteMapping("/sessions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSession(@PathVariable UUID id) {
        sessionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- SETTINGS ---

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings() {
        SystemConfig config = systemConfigService.getConfig(SETTINGS_CONFIG_KEY);
        if (config == null) {
            // Return defaults if not configured
            return ResponseEntity.ok(DEFAULT_SETTINGS_JSON);
        }
        return ResponseEntity.ok(config.getConfigValue());
    }

    @PostMapping("/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> saveSettings(@RequestBody String jsonPayload) {
        try {
            // Verify it is a valid JSON string
            new com.fasterxml.jackson.databind.ObjectMapper().readTree(jsonPayload);
            SystemConfig updated = systemConfigService.updateConfig(SETTINGS_CONFIG_KEY, jsonPayload);
            return ResponseEntity.ok(updated.getConfigValue());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi định dạng JSON: " + e.getMessage()));
        }
    }
}
