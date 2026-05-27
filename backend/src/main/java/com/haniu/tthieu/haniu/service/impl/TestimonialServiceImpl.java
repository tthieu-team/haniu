package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.marketing.Testimonial;
import com.haniu.tthieu.haniu.repository.TestimonialRepository;
import com.haniu.tthieu.haniu.service.TestimonialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TestimonialServiceImpl implements TestimonialService {

    private final TestimonialRepository testimonialRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Testimonial> getActiveTestimonials() {
        return testimonialRepository.findAllByActiveTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Testimonial getTestimonialById(UUID id) {
        return testimonialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy testimonial với ID: " + id));
    }

    @Override
    public Testimonial createTestimonial(Testimonial testimonial) {
        log.info("Creating new testimonial from: {}", testimonial.getName());
        return testimonialRepository.save(testimonial);
    }

    @Override
    public Testimonial updateTestimonial(UUID id, Testimonial data) {
        Testimonial existing = getTestimonialById(id);
        existing.setName(data.getName());
        existing.setRole(data.getRole());
        existing.setContent(data.getContent());
        existing.setRating(data.getRating());
        existing.setAvatar(data.getAvatar());
        existing.setActive(data.isActive());
        
        log.info("Updating testimonial with ID: {}", id);
        return testimonialRepository.save(existing);
    }

    @Override
    public void deleteTestimonial(UUID id) {
        Testimonial existing = getTestimonialById(id);
        log.info("Deleting testimonial with ID: {}", id);
        testimonialRepository.delete(existing);
    }
}
