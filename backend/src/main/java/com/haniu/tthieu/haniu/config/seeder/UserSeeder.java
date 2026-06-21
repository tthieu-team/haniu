package com.haniu.tthieu.haniu.config.seeder;

import com.haniu.tthieu.haniu.entity.enums.Role;
import com.haniu.tthieu.haniu.entity.enums.UserStatus;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void seed() {
        if (!userRepository.existsByEmail("admin@haniu.vn")) {
            log.info("Seeding admin user...");
            User admin = User.builder()
                    .email("admin@haniu.vn")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Haniu Admin")
                    .phone("0987654321")
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user successfully seeded!");
        }

        if (!userRepository.existsByEmail("test@haniu.vn")) {
            log.info("Seeding test user...");
            User testUser = User.builder()
                    .email("test@haniu.vn")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Nguyễn Văn Haniu")
                    .phone("0987654321")
                    .role(Role.USER)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .build();
            userRepository.save(testUser);
            log.info("Test user successfully seeded!");
        }
    }
}
