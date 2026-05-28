package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByOrderId(UUID orderId);
    boolean existsByVariantId(UUID variantId);

    @Query("SELECT oi FROM OrderItem oi " +
           "WHERE oi.order.user.email = :email " +
           "AND oi.product.id = :productId " +
           "AND oi.order.orderStatus = com.haniu.tthieu.haniu.entity.enums.OrderStatus.DELIVERED " +
           "AND NOT EXISTS (SELECT r FROM Review r WHERE r.orderItem.id = oi.id)")
    List<OrderItem> findUnreviewedItems(String email, UUID productId);
}
