package com.haniu.tthieu.haniu.entity.marketing;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "ugc_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UgcItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String link;

    @Builder.Default
    private boolean active = true;
}
