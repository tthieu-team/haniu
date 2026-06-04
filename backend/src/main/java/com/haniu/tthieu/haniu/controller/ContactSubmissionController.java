package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.feedback.ContactSubmission;
import com.haniu.tthieu.haniu.service.ContactSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactSubmissionController {

    private final ContactSubmissionService contactSubmissionService;

    @PostMapping
    public ResponseEntity<ContactSubmission> submitContact(@RequestBody ContactSubmission submission) {
        try {
            return ResponseEntity.ok(contactSubmissionService.submitContact(submission));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactSubmission>> getAllSubmissions() {
        return ResponseEntity.ok(contactSubmissionService.getAllSubmissions());
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactSubmission> markAsRead(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(contactSubmissionService.markAsRead(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSubmission(@PathVariable UUID id) {
        try {
            contactSubmissionService.deleteSubmission(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
