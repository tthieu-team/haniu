package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.product.*;

import java.util.List;
import java.util.UUID;

public interface CatalogService {
    List<Category> getAllCategories();
    Category createCategory(Category category);
    Category updateCategory(UUID id, Category category);
    void deleteCategory(UUID id);

    List<Brand> getAllBrands();
    Brand createBrand(Brand brand);
    void deleteBrand(UUID id);

    List<Collection> getAllCollections();
    Collection createCollection(Collection collection);
    Collection getCollectionById(UUID id);
    Collection getCollectionBySlug(String slug);
    Collection updateCollection(UUID id, Collection collection);
    void deleteCollection(UUID id);

    List<Occasion> getAllOccasions();
    Occasion createOccasion(Occasion occasion);
    void deleteOccasion(UUID id);

    List<Recipient> getAllRecipients();
    Recipient createRecipient(Recipient recipient);
    void deleteRecipient(UUID id);

    List<AttributeDefinition> getAttributeDefinitionsByCategory(UUID categoryId);
    List<AttributeDefinition> getGlobalAttributeDefinitions();
    AttributeDefinition createAttributeDefinition(AttributeDefinition def);
    void deleteAttributeDefinition(UUID id);
}
