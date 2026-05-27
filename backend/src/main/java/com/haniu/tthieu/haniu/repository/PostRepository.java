package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.marketing.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByActiveTrueOrderByPublishedAtDesc();
    Optional<Post> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
