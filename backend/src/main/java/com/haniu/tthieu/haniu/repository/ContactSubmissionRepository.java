package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.feedback.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, UUID> {
    List<ContactSubmission> findAllByOrderByCreatedAtDesc();
}
