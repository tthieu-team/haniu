package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.order.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByOrderOrderCode(String orderCode);
    Optional<Payment> findByTransactionCode(String transactionCode);
}
