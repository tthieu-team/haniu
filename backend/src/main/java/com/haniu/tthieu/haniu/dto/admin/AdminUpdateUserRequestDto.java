package com.haniu.tthieu.haniu.dto.admin;

import com.haniu.tthieu.haniu.entity.enums.Role;
import com.haniu.tthieu.haniu.entity.enums.UserStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUpdateUserRequestDto {
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String gender;
    private LocalDate birthday;
    private Role role;
    private UserStatus status;
    private Boolean emailVerified;
    private Boolean phoneVerified;
}
