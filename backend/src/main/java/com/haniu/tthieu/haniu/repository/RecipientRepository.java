package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.product.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecipientRepository extends JpaRepository<Recipient, UUID> {
    List<Recipient> findByIsActiveTrue();
    Optional<Recipient> findBySlug(String slug);
}
