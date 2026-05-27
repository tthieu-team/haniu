package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.marketing.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, UUID> {
    List<Testimonial> findAllByActiveTrue();
}
