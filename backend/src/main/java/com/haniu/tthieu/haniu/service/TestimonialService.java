package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.marketing.Testimonial;

import java.util.List;
import java.util.UUID;

public interface TestimonialService {
    List<Testimonial> getAllTestimonials();
    List<Testimonial> getActiveTestimonials();
    Testimonial getTestimonialById(UUID id);
    Testimonial createTestimonial(Testimonial testimonial);
    Testimonial updateTestimonial(UUID id, Testimonial testimonial);
    void deleteTestimonial(UUID id);
}
