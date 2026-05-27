package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.marketing.UgcItem;
import com.haniu.tthieu.haniu.repository.UgcItemRepository;
import com.haniu.tthieu.haniu.service.UgcItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UgcItemServiceImpl implements UgcItemService {

    private final UgcItemRepository ugcItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UgcItem> getAllUgcItems() {
        return ugcItemRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UgcItem> getActiveUgcItems() {
        return ugcItemRepository.findAllByActiveTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public UgcItem getUgcItemById(UUID id) {
        return ugcItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy UGC Item với ID: " + id));
    }

    @Override
    public UgcItem createUgcItem(UgcItem ugcItem) {
        log.info("Creating new UGC Feed item");
        return ugcItemRepository.save(ugcItem);
    }

    @Override
    public UgcItem updateUgcItem(UUID id, UgcItem data) {
        UgcItem existing = getUgcItemById(id);
        existing.setImageUrl(data.getImageUrl());
        existing.setLink(data.getLink());
        existing.setActive(data.isActive());

        log.info("Updating UGC Feed item with ID: {}", id);
        return ugcItemRepository.save(existing);
    }

    @Override
    public void deleteUgcItem(UUID id) {
        UgcItem existing = getUgcItemById(id);
        log.info("Deleting UGC Feed item with ID: {}", id);
        ugcItemRepository.delete(existing);
    }
}
