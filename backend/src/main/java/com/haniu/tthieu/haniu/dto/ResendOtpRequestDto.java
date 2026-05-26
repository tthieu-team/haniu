package com.haniu.tthieu.haniu.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResendOtpRequestDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;
}
