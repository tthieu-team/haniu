package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.product.*;
import com.haniu.tthieu.haniu.repository.*;
import com.haniu.tthieu.haniu.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
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
    public Collection createCollection(Collection collection) {
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
}
