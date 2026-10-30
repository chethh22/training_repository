package com.chethan.recharge.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RechargeResponse(
        String message,
        String customerName,
        String customerNumber,
        String planName,
        BigDecimal amount,
        Integer validityDays,
        LocalDate validUntil
) {}
