package com.haniu.tthieu.haniu.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Stores a file and returns its public URL/URI.
     */
    String store(MultipartFile file);

    /**
     * Stores a file in a specific subfolder and returns its public URL/URI.
     */
    String store(MultipartFile file, String subfolder);

    /**
     * Deletes a file given its URL/URI.
     */
    void delete(String fileUrl);
}
