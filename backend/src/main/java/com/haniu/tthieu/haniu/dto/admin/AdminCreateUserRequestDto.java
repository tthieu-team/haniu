package com.haniu.tthieu.haniu.dto.admin;

import com.haniu.tthieu.haniu.entity.enums.Role;
import com.haniu.tthieu.haniu.entity.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCreateUserRequestDto {
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    private String password;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    private String phone;
    private String avatarUrl;
    private String gender;
    private LocalDate birthday;
    private Role role;
    private UserStatus status;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private Boolean sendEmail;
}
