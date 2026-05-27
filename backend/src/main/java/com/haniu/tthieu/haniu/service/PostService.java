package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.marketing.Post;

import java.util.List;
import java.util.UUID;

public interface PostService {
    List<Post> getAllPosts();
    List<Post> getActivePosts();
    Post getPostById(UUID id);
    Post getPostBySlug(String slug);
    Post createPost(Post post);
    Post updatePost(UUID id, Post post);
    void deletePost(UUID id);
}
