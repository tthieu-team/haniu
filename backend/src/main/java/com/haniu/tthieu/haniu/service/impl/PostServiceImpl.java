package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.marketing.Post;
import com.haniu.tthieu.haniu.repository.PostRepository;
import com.haniu.tthieu.haniu.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getActivePosts() {
        return postRepository.findAllByActiveTrueOrderByPublishedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Post getPostById(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài viết với ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Post getPostBySlug(String slug) {
        return postRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài viết với Slug: " + slug));
    }

    @Override
    public Post createPost(Post post) {
        if (post.getSlug() == null || post.getSlug().trim().isEmpty()) {
            post.setSlug(generateUniqueSlug(post.getTitle()));
        } else {
            post.setSlug(post.getSlug().toLowerCase().trim().replaceAll("\\s+", "-"));
            if (postRepository.existsBySlug(post.getSlug())) {
                throw new IllegalArgumentException("Slug đã tồn tại: " + post.getSlug());
            }
        }
        
        if (post.isActive() && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        
        log.info("Creating new blog post: {}", post.getTitle());
        return postRepository.save(post);
    }

    @Override
    public Post updatePost(UUID id, Post postData) {
        Post existing = getPostById(id);
        existing.setTitle(postData.getTitle());
        existing.setSummary(postData.getSummary());
        existing.setContent(postData.getContent());
        existing.setImageUrl(postData.getImageUrl());
        
        boolean wasActive = existing.isActive();
        existing.setActive(postData.isActive());
        
        if (postData.getSlug() != null && !postData.getSlug().trim().isEmpty()) {
            String newSlug = postData.getSlug().toLowerCase().trim().replaceAll("\\s+", "-");
            if (!existing.getSlug().equals(newSlug)) {
                if (postRepository.existsBySlug(newSlug)) {
                    throw new IllegalArgumentException("Slug đã tồn tại: " + newSlug);
                }
                existing.setSlug(newSlug);
            }
        } else {
            existing.setSlug(generateUniqueSlug(postData.getTitle()));
        }

        if (existing.isActive() && existing.getPublishedAt() == null) {
            existing.setPublishedAt(LocalDateTime.now());
        } else if (!existing.isActive() && wasActive) {
            existing.setPublishedAt(null);
        }

        log.info("Updating blog post with ID: {}", id);
        return postRepository.save(existing);
    }

    @Override
    public void deletePost(UUID id) {
        Post existing = getPostById(id);
        log.info("Deleting blog post: {}", existing.getTitle());
        postRepository.delete(existing);
    }

    private String generateUniqueSlug(String title) {
        if (title == null || title.trim().isEmpty()) {
            return UUID.randomUUID().toString();
        }
        String baseSlug = slugify(title);
        String slug = baseSlug;
        int count = 1;
        while (postRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count;
            count++;
        }
        return slug;
    }

    private String slugify(String input) {
        String normalized = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFD);
        String result = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        result = result.toLowerCase()
                .replaceAll("đ", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
        if (result.isEmpty()) {
            return "post";
        }
        return result;
    }
}
