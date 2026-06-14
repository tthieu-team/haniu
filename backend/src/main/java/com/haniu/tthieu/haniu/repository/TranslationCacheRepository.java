package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.system.TranslationCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TranslationCacheRepository extends JpaRepository<TranslationCache, UUID> {
    Optional<TranslationCache> findByTextHashAndTargetLang(String textHash, String targetLang);
}
