package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.feedback.ContactSubmission;
import com.haniu.tthieu.haniu.repository.ContactSubmissionRepository;
import com.haniu.tthieu.haniu.service.ContactSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactSubmissionServiceImpl implements ContactSubmissionService {

    private final ContactSubmissionRepository contactSubmissionRepository;

    @Override
    public ContactSubmission submitContact(ContactSubmission submission) {
        // Validation basic
        if (submission.getFullName() == null || submission.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Họ tên không được trống");
        }
        if (submission.getEmail() == null || submission.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được trống");
        }
        if (submission.getMessage() == null || submission.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung không được trống");
        }
        
        submission.setRead(false);
        return contactSubmissionRepository.save(submission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactSubmission> getAllSubmissions() {
        return contactSubmissionRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public ContactSubmission markAsRead(UUID id) {
        ContactSubmission submission = contactSubmissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy liên hệ với ID: " + id));
        submission.setRead(true);
        return contactSubmissionRepository.save(submission);
    }

    @Override
    public void deleteSubmission(UUID id) {
        if (!contactSubmissionRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy liên hệ với ID: " + id);
        }
        contactSubmissionRepository.deleteById(id);
    }
}
