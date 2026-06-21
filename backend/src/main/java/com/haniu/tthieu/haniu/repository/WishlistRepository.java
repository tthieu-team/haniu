package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.feedback.Wishlist;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
}
