package com.haniu.tthieu.haniu.entity.system;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "neon_databases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NeonDatabase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "connection_url", columnDefinition = "TEXT", nullable = false)
    private String connectionUrl;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = false;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private int sortOrder = 0;

    @Column(name = "last_switched_at")
    private LocalDateTime lastSwitchedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
