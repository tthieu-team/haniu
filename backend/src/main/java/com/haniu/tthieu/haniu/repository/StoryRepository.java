package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.marketing.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StoryRepository extends JpaRepository<Story, UUID> {
}
