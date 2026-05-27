package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.marketing.UgcItem;
import com.haniu.tthieu.haniu.service.UgcItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ugc-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UgcItemController {

    private final UgcItemService ugcItemService;

    @GetMapping
    public ResponseEntity<List<UgcItem>> getActiveUgcItems() {
        return ResponseEntity.ok(ugcItemService.getActiveUgcItems());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UgcItem>> getAllUgcItems() {
        return ResponseEntity.ok(ugcItemService.getAllUgcItems());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UgcItem> createUgcItem(@RequestBody UgcItem ugcItem) {
        return ResponseEntity.ok(ugcItemService.createUgcItem(ugcItem));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UgcItem> updateUgcItem(@PathVariable UUID id, @RequestBody UgcItem ugcItem) {
        try {
            return ResponseEntity.ok(ugcItemService.updateUgcItem(id, ugcItem));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUgcItem(@PathVariable UUID id) {
        try {
            ugcItemService.deleteUgcItem(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
