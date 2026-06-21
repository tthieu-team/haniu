package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.feedback.Wishlist;
import com.haniu.tthieu.haniu.entity.product.Product;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.repository.ProductRepository;
import com.haniu.tthieu.haniu.repository.WishlistRepository;
import com.haniu.tthieu.haniu.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    @Override
    public Wishlist toggleWishlist(User user, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Wishlist> existing = wishlistRepository.findByUserAndProduct(user, product);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return null;
        } else {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            return wishlistRepository.save(wishlist);
        }
    }

    @Override
    public Wishlist addToWishlist(User user, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            return null;
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();
        return wishlistRepository.save(wishlist);
    }

    @Override
    public void removeFromWishlist(User user, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getWishlistProducts(User user) {
        return wishlistRepository.findByUser(user).stream()
                .map(Wishlist::getProduct)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWishlist(User user, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return wishlistRepository.existsByUserAndProduct(user, product);
    }

    @Override
    public void clearWishlist(User user) {
        List<Wishlist> items = wishlistRepository.findByUser(user);
        wishlistRepository.deleteAll(items);
    }
}
