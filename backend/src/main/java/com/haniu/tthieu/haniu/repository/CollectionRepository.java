package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.product.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, UUID> {
    List<Collection> findByIsActiveTrue();
    Optional<Collection> findBySlug(String slug);
}
