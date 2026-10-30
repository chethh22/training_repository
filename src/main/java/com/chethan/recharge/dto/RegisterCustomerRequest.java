package com.chethan.recharge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterCustomerRequest(

        @NotBlank(message = "Customer name is required")
        String customerName,

        @NotBlank(message = "Customer number is required")
        @Pattern(regexp = "\\d{10}", message = "Customer number must contain exactly 10 digits")
        String customerNumber

) {
}