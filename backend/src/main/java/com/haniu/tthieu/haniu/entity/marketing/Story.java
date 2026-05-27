package com.haniu.tthieu.haniu.entity.marketing;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "stories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "video_placeholder_url")
    private String videoPlaceholderUrl;

    @Column(name = "video_title")
    private String videoTitle;
}
