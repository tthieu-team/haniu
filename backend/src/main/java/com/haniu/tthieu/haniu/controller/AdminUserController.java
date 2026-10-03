package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.dto.admin.AdminCreateUserRequestDto;
import com.haniu.tthieu.haniu.dto.admin.AdminResetPasswordRequestDto;
import com.haniu.tthieu.haniu.dto.admin.AdminUpdateUserRequestDto;
import com.haniu.tthieu.haniu.dto.admin.AdminUserResponseDto;
import com.haniu.tthieu.haniu.entity.enums.Role;
import com.haniu.tthieu.haniu.entity.enums.UserStatus;
import com.haniu.tthieu.haniu.entity.order.Order;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.repository.OrderRepository;
import com.haniu.tthieu.haniu.repository.UserRepository;
import com.haniu.tthieu.haniu.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AdminUserController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // --- 1. USER STATISTICS ---
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.size();
        long activeUsers = allUsers.stream().filter(u -> u.getStatus() == UserStatus.ACTIVE).count();
        long adminUsers = allUsers.stream().filter(u -> u.getRole() == Role.ADMIN).count();
        long blockedUsers = allUsers.stream().filter(u -> u.getStatus() == UserStatus.BLOCKED).count();

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        long newUsersThisMonth = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(startOfMonth))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("adminUsers", adminUsers);
        stats.put("blockedUsers", blockedUsers);
        stats.put("newUsersThisMonth", newUsersThisMonth);

        return ResponseEntity.ok(stats);
    }

    // --- 2. LIST USERS WITH FILTER & PAGINATION ---
    @GetMapping
    public ResponseEntity<Page<AdminUserResponseDto>> getUsers(
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(name = "role", required = false) String role,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "desc") String sortDir
    ) {
        List<User> users = userRepository.findAll();

        // 1. Text Search Filter
        if (query != null && !query.trim().isEmpty()) {
            String lowerQ = query.trim().toLowerCase();
            users = users.stream().filter(u ->
                    (u.getEmail() != null && u.getEmail().toLowerCase().contains(lowerQ)) ||
                    (u.getFullName() != null && u.getFullName().toLowerCase().contains(lowerQ)) ||
                    (u.getPhone() != null && u.getPhone().toLowerCase().contains(lowerQ))
            ).collect(Collectors.toList());
        }

        // 2. Role Filter
        if (role != null && !role.isBlank() && !"ALL".equalsIgnoreCase(role)) {
            try {
                Role roleEnum = Role.valueOf(role.toUpperCase());
                users = users.stream().filter(u -> u.getRole() == roleEnum).collect(Collectors.toList());
            } catch (Exception ignored) {}
        }

        // 3. Status Filter
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            try {
                UserStatus statusEnum = UserStatus.valueOf(status.toUpperCase());
                users = users.stream().filter(u -> u.getStatus() == statusEnum).collect(Collectors.toList());
            } catch (Exception ignored) {}
        }

        // 4. Sorting
        Comparator<User> comparator;
        if ("fullName".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(u -> (u.getFullName() != null ? u.getFullName() : ""), String.CASE_INSENSITIVE_ORDER);
        } else if ("email".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(u -> (u.getEmail() != null ? u.getEmail() : ""), String.CASE_INSENSITIVE_ORDER);
        } else if ("lastLoginAt".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(User::getLastLoginAt, Comparator.nullsLast(Comparator.naturalOrder()));
        } else {
            comparator = Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
        }

        if ("desc".equalsIgnoreCase(sortDir)) {
            comparator = comparator.reversed();
        }
        users.sort(comparator);

        // 5. Pagination
        int totalElements = users.size();
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);
        List<User> pagedUsers = users.subList(fromIndex, toIndex);

        // Map to Response DTO with Order Summaries
        List<AdminUserResponseDto> dtoList = pagedUsers.stream().map(this::mapToSummaryDto).collect(Collectors.toList());

        Page<AdminUserResponseDto> resultPage = new PageImpl<>(
                dtoList,
                PageRequest.of(page, size, Sort.by("desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy)),
                totalElements
        );

        return ResponseEntity.ok(resultPage);
    }

    // --- 3. GET SINGLE USER DETAIL ---
    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponseDto> getUserDetail(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        AdminUserResponseDto dto = mapToSummaryDto(user);

        // Include recent orders
        if (user.getEmail() != null) {
            List<Order> orders = orderRepository.findByUserEmailOrderByCreatedAtDesc(user.getEmail());
            dto.setRecentOrders(orders.stream().limit(5).map(o -> AdminUserResponseDto.UserOrderSummaryDto.builder()
                    .id(o.getId())
                    .orderCode(o.getOrderCode())
                    .totalAmount(o.getTotalPrice())
                    .status(o.getOrderStatus() != null ? o.getOrderStatus().name() : "")
                    .createdAt(o.getCreatedAt())
                    .build()
            ).collect(Collectors.toList()));
        }

        return ResponseEntity.ok(dto);
    }

    // --- 4. CREATE USER ---
    @PostMapping
    public ResponseEntity<AdminUserResponseDto> createUser(@Valid @RequestBody AdminCreateUserRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email này đã được sử dụng trong hệ thống.");
        }

        String rawPassword = request.getPassword();
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            rawPassword = generateSecurePassword();
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(rawPassword))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .avatarUrl(request.getAvatarUrl())
                .gender(request.getGender())
                .birthday(request.getBirthday())
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .status(request.getStatus() != null ? request.getStatus() : UserStatus.ACTIVE)
                .emailVerified(request.getEmailVerified() != null ? request.getEmailVerified() : true)
                .phoneVerified(request.getPhoneVerified() != null ? request.getPhoneVerified() : false)
                .build();

        User savedUser = userRepository.save(user);

        // Send email if requested
        if (Boolean.TRUE.equals(request.getSendEmail())) {
            try {
                emailService.sendAdminPasswordReset(savedUser.getEmail(), savedUser.getFullName(), rawPassword);
            } catch (Exception e) {
                log.error("Không thể gửi email thông báo tài khoản mới: " + savedUser.getEmail(), e);
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToSummaryDto(savedUser));
    }

    // --- 5. UPDATE USER ---
    @PutMapping("/{id}")
    public ResponseEntity<AdminUserResponseDto> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody AdminUpdateUserRequestDto request
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        if (request.getFullName() != null) user.setFullName(request.getFullName().trim());
        if (request.getPhone() != null) user.setPhone(request.getPhone().trim());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getBirthday() != null) user.setBirthday(request.getBirthday());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getEmailVerified() != null) user.setEmailVerified(request.getEmailVerified());
        if (request.getPhoneVerified() != null) user.setPhoneVerified(request.getPhoneVerified());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(mapToSummaryDto(updatedUser));
    }

    // --- 6. CHANGE USER STATUS (ACTIVE / BLOCKED / PENDING) ---
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> changeStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        String statusStr = body.get("status");
        if (statusStr != null) {
            UserStatus status = UserStatus.valueOf(statusStr.toUpperCase());
            user.setStatus(status);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật trạng thái người dùng thành công",
                "status", user.getStatus().name()
        ));
    }

    // --- 7. RESET PASSWORD & SEND EMAIL ---
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @PathVariable UUID id,
            @RequestBody(required = false) AdminResetPasswordRequestDto request
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        String rawPassword = (request != null && request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty())
                ? request.getNewPassword().trim()
                : generateSecurePassword();

        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);

        boolean emailSent = false;
        boolean sendEmail = request == null || request.getSendEmail() == null || Boolean.TRUE.equals(request.getSendEmail());
        if (sendEmail) {
            try {
                emailService.sendAdminPasswordReset(user.getEmail(), user.getFullName(), rawPassword);
                emailSent = true;
            } catch (Exception e) {
                log.error("Lỗi khi gửi email cấp lại mật khẩu tới " + user.getEmail(), e);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cấp lại mật khẩu thành công");
        response.put("newPassword", rawPassword);
        response.put("emailSent", emailSent);
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    // --- 8. DELETE USER ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đã xóa người dùng thành công"));
    }

    // --- PRIVATE HELPERS ---
    private AdminUserResponseDto mapToSummaryDto(User user) {
        long totalOrders = 0;
        BigDecimal totalSpent = BigDecimal.ZERO;

        if (user.getEmail() != null) {
            List<Order> userOrders = orderRepository.findByUserEmailOrderByCreatedAtDesc(user.getEmail());
            totalOrders = userOrders.size();
            totalSpent = userOrders.stream()
                    .filter(o -> o.getTotalPrice() != null)
                    .map(Order::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        return AdminUserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .gender(user.getGender())
                .birthday(user.getBirthday())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .totalOrders(totalOrders)
                .totalSpent(totalSpent)
                .build();
    }

    private String generateSecurePassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder("Haniu@");
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
