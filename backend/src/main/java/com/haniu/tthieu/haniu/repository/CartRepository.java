package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUserEmail(String email);
    Optional<Cart> findBySessionId(String sessionId);
}
