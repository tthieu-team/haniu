package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.product.*;
import com.haniu.tthieu.haniu.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CatalogController {

    private final CatalogService catalogService;

    // Categories
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(catalogService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(catalogService.createCategory(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable UUID id, @RequestBody Category category) {
        return ResponseEntity.ok(catalogService.updateCategory(id, category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        catalogService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // Brands
    @GetMapping("/brands")
    public ResponseEntity<List<Brand>> getBrands() {
        return ResponseEntity.ok(catalogService.getAllBrands());
    }

    @PostMapping("/brands")
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        return ResponseEntity.ok(catalogService.createBrand(brand));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable UUID id) {
        catalogService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

    // Collections
    @GetMapping("/collections")
    public ResponseEntity<List<Collection>> getCollections() {
        return ResponseEntity.ok(catalogService.getAllCollections());
    }

    @GetMapping("/collections/{id}")
    public ResponseEntity<Collection> getCollectionById(@PathVariable UUID id) {
        return ResponseEntity.ok(catalogService.getCollectionById(id));
    }

    @GetMapping("/collections/slug/{slug}")
    public ResponseEntity<Collection> getCollectionBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(catalogService.getCollectionBySlug(slug));
    }

    @PostMapping("/collections")
    public ResponseEntity<Collection> createCollection(@RequestBody Collection collection) {
        return ResponseEntity.ok(catalogService.createCollection(collection));
    }

    @PutMapping("/collections/{id}")
    public ResponseEntity<Collection> updateCollection(@PathVariable UUID id, @RequestBody Collection collection) {
        return ResponseEntity.ok(catalogService.updateCollection(id, collection));
    }

    @DeleteMapping("/collections/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable UUID id) {
        catalogService.deleteCollection(id);
        return ResponseEntity.noContent().build();
    }

    // Occasions
    @GetMapping("/occasions")
    public ResponseEntity<List<Occasion>> getOccasions() {
        return ResponseEntity.ok(catalogService.getAllOccasions());
    }

    @PostMapping("/occasions")
    public ResponseEntity<Occasion> createOccasion(@RequestBody Occasion occasion) {
        return ResponseEntity.ok(catalogService.createOccasion(occasion));
    }

    @DeleteMapping("/occasions/{id}")
    public ResponseEntity<Void> deleteOccasion(@PathVariable UUID id) {
        catalogService.deleteOccasion(id);
        return ResponseEntity.noContent().build();
    }

    // Recipients
    @GetMapping("/recipients")
    public ResponseEntity<List<Recipient>> getRecipients() {
        return ResponseEntity.ok(catalogService.getAllRecipients());
    }

    @PostMapping("/recipients")
    public ResponseEntity<Recipient> createRecipient(@RequestBody Recipient recipient) {
        return ResponseEntity.ok(catalogService.createRecipient(recipient));
    }

    @DeleteMapping("/recipients/{id}")
    public ResponseEntity<Void> deleteRecipient(@PathVariable UUID id) {
        catalogService.deleteRecipient(id);
        return ResponseEntity.noContent().build();
    }

    // Attribute Definitions
    @GetMapping("/attribute-definitions")
    public ResponseEntity<List<AttributeDefinition>> getAttributeDefinitions(
            @RequestParam(required = false) UUID categoryId) {
        if (categoryId != null) {
            return ResponseEntity.ok(catalogService.getAttributeDefinitionsByCategory(categoryId));
        } else {
            return ResponseEntity.ok(catalogService.getGlobalAttributeDefinitions());
        }
    }

    @PostMapping("/attribute-definitions")
    public ResponseEntity<AttributeDefinition> createAttributeDefinition(@RequestBody AttributeDefinition def) {
        return ResponseEntity.ok(catalogService.createAttributeDefinition(def));
    }

    @DeleteMapping("/attribute-definitions/{id}")
    public ResponseEntity<Void> deleteAttributeDefinition(@PathVariable UUID id) {
        catalogService.deleteAttributeDefinition(id);
        return ResponseEntity.noContent().build();
    }
}
