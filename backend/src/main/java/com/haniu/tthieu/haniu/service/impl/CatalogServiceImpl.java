package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.product.*;
import com.haniu.tthieu.haniu.repository.*;
import com.haniu.tthieu.haniu.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CatalogServiceImpl implements CatalogService {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final CollectionRepository collectionRepository;
    private final OccasionRepository occasionRepository;
    private final RecipientRepository recipientRepository;
    private final AttributeDefinitionRepository attributeDefinitionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(UUID id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDetails.getName());
        category.setSlug(categoryDetails.getSlug());
        category.setDescription(categoryDetails.getDescription());
        category.setImageUrl(categoryDetails.getImageUrl());
        category.setBannerUrl(categoryDetails.getBannerUrl());
        category.setSortOrder(categoryDetails.getSortOrder());
        category.setActive(categoryDetails.isActive());
        category.setFeatured(categoryDetails.isFeatured());
        category.setSeoTitle(categoryDetails.getSeoTitle());
        category.setSeoDescription(categoryDetails.getSeoDescription());
        category.setSeoKeywords(categoryDetails.getSeoKeywords());
        
        // Handle parent category update
        if (categoryDetails.getParent() != null && categoryDetails.getParent().getId() != null) {
            Category parent = categoryRepository.findById(categoryDetails.getParent().getId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            
            // Prevent cyclic dependency (parent cannot be itself)
            if (parent.getId().equals(id)) {
                throw new RuntimeException("A category cannot be its own parent");
            }
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setDeletedAt(LocalDateTime.now());
        categoryRepository.save(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Override
    public void deleteBrand(UUID id) {
        brandRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Collection> getAllCollections() {
        return collectionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Collection getCollectionById(UUID id) {
        return collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Collection getCollectionBySlug(String slug) {
        return collectionRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Collection not found with slug: " + slug));
    }

    @Override
    public Collection createCollection(Collection collection) {
        return collectionRepository.save(collection);
    }

    @Override
    public Collection updateCollection(UUID id, Collection collectionDetails) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found"));
        
        collection.setName(collectionDetails.getName());
        collection.setSlug(collectionDetails.getSlug());
        collection.setDescription(collectionDetails.getDescription());
        collection.setImageUrl(collectionDetails.getImageUrl());
        collection.setBannerUrl(collectionDetails.getBannerUrl());
        collection.setActive(collectionDetails.isActive());
        
        return collectionRepository.save(collection);
    }

    @Override
    public void deleteCollection(UUID id) {
        collectionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Occasion> getAllOccasions() {
        return occasionRepository.findAll();
    }

    @Override
    public Occasion createOccasion(Occasion occasion) {
        return occasionRepository.save(occasion);
    }

    @Override
    public void deleteOccasion(UUID id) {
        occasionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Recipient> getAllRecipients() {
        return recipientRepository.findAll();
    }

    @Override
    public Recipient createRecipient(Recipient recipient) {
        return recipientRepository.save(recipient);
    }

    @Override
    public void deleteRecipient(UUID id) {
        recipientRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttributeDefinition> getAttributeDefinitionsByCategory(UUID categoryId) {
        return attributeDefinitionRepository.findByCategoryIdOrCategoryIsNull(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttributeDefinition> getGlobalAttributeDefinitions() {
        return attributeDefinitionRepository.findByCategoryIsNull();
    }

    @Override
    public AttributeDefinition createAttributeDefinition(AttributeDefinition def) {
        return attributeDefinitionRepository.save(def);
    }

    @Override
    public void deleteAttributeDefinition(UUID id) {
        attributeDefinitionRepository.deleteById(id);
    }
}
