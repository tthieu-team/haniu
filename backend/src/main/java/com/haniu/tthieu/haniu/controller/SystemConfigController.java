package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.system.SystemConfig;
import com.haniu.tthieu.haniu.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/system-configs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @GetMapping("/{key}")
    public ResponseEntity<?> getConfig(@PathVariable String key) {
        SystemConfig config = systemConfigService.getConfig(key);
        if (config == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(config);
    }

    @PostMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateConfig(@PathVariable String key, @RequestBody String jsonPayload) {
        try {
            // Verify it is a valid JSON string
            new com.fasterxml.jackson.databind.ObjectMapper().readTree(jsonPayload);
            SystemConfig updated = systemConfigService.updateConfig(key, jsonPayload);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cấu hình không đúng định dạng JSON: " + e.getMessage()));
        }
    }
}
