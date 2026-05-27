package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.marketing.Testimonial;
import com.haniu.tthieu.haniu.service.TestimonialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/testimonials")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestimonialController {

    private final TestimonialService testimonialService;

    @GetMapping
    public ResponseEntity<List<Testimonial>> getActiveTestimonials() {
        return ResponseEntity.ok(testimonialService.getActiveTestimonials());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        return ResponseEntity.ok(testimonialService.getAllTestimonials());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialService.createTestimonial(testimonial));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable UUID id, @RequestBody Testimonial testimonial) {
        try {
            return ResponseEntity.ok(testimonialService.updateTestimonial(id, testimonial));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable UUID id) {
        try {
            testimonialService.deleteTestimonial(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
