package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.feedback.ContactSubmission;

import java.util.List;
import java.util.UUID;

public interface ContactSubmissionService {
    ContactSubmission submitContact(ContactSubmission submission);
    List<ContactSubmission> getAllSubmissions();
    ContactSubmission markAsRead(UUID id);
    void deleteSubmission(UUID id);
}
