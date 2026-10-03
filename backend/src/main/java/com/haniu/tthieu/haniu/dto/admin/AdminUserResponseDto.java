package com.haniu.tthieu.haniu.dto.admin;

import com.haniu.tthieu.haniu.entity.enums.Role;
import com.haniu.tthieu.haniu.entity.enums.UserStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponseDto {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String gender;
    private LocalDate birthday;
    private Role role;
    private UserStatus status;
    private boolean emailVerified;
    private boolean phoneVerified;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long totalOrders;
    private BigDecimal totalSpent;
    private List<UserOrderSummaryDto> recentOrders;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserOrderSummaryDto {
        private UUID id;
        private String orderCode;
        private BigDecimal totalAmount;
        private String status;
        private LocalDateTime createdAt;
    }
}
