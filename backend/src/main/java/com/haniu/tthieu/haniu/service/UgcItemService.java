package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.marketing.UgcItem;

import java.util.List;
import java.util.UUID;

public interface UgcItemService {
    List<UgcItem> getAllUgcItems();
    List<UgcItem> getActiveUgcItems();
    UgcItem getUgcItemById(UUID id);
    UgcItem createUgcItem(UgcItem ugcItem);
    UgcItem updateUgcItem(UUID id, UgcItem ugcItem);
    void deleteUgcItem(UUID id);
}
