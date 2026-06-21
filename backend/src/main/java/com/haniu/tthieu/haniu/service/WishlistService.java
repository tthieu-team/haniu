package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.feedback.Wishlist;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.entity.product.Product;

import java.util.List;
import java.util.UUID;

public interface WishlistService {
    Wishlist toggleWishlist(User user, UUID productId);
    Wishlist addToWishlist(User user, UUID productId);
    void removeFromWishlist(User user, UUID productId);
    List<Product> getWishlistProducts(User user);
    boolean isInWishlist(User user, UUID productId);
    void clearWishlist(User user);
}
