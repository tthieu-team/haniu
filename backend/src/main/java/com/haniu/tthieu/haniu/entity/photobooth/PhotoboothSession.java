package com.haniu.tthieu.haniu.entity.photobooth;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "photobooth_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotoboothSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "template_name")
    private String templateName;

    @Column(name = "photos_count")
    private Integer photosCount;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    private String status; // Completed, Interrupted

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
