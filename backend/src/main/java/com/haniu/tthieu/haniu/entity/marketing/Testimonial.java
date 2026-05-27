package com.haniu.tthieu.haniu.entity.marketing;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "testimonials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String role;

    @Column(columnDefinition = "TEXT")
    private String content;

    private int rating;

    private String avatar;

    @Builder.Default
    private boolean active = true;
}
