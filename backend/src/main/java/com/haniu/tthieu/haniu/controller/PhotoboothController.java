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

    private static final String SETTINGS_CONFIG_KEY = "photobooth_settings";
    private static final String DEFAULT_SETTINGS_JSON = "{\"countdown\":5,\"quality\":\"high\",\"defaultFrameColor\":\"#ffffff\",\"watermarkText\":\"🎀 Haniu Photobooth\",\"isSoundEnabled\":true,\"showDate\":true}";

    // --- EVENTS ---

    @GetMapping("/events")
    public ResponseEntity<List<PhotoboothEvent>> getEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoboothEvent> saveEvent(@RequestBody PhotoboothEvent event) {
        if (event.getId() != null && !eventRepository.existsById(event.getId())) {
            event.setId(null);
        }
        return ResponseEntity.ok(eventRepository.save(event));
    }

    @DeleteMapping("/events/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- TEMPLATES ---

    @GetMapping("/templates")
    public ResponseEntity<List<PhotoboothTemplate>> getTemplates() {
        return ResponseEntity.ok(templateRepository.findAll());
    }

    @PostMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoboothTemplate> saveTemplate(@RequestBody PhotoboothTemplate template) {
        if (template.getId() != null && !templateRepository.existsById(template.getId())) {
            template.setId(null);
        }
        return ResponseEntity.ok(templateRepository.save(template));
    }

    @DeleteMapping("/templates/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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
        return ResponseEntity.ok(sessionRepository.save(session));
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
