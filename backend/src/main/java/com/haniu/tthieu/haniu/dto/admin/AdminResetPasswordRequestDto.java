package com.haniu.tthieu.haniu.dto.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminResetPasswordRequestDto {
    private String newPassword;
    private Boolean sendEmail;
}
