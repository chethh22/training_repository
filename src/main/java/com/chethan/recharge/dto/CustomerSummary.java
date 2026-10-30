package com.chethan.recharge.dto;

import com.chethan.recharge.entity.Customer;

public record CustomerSummary(
        String customerName,
        String customerNumber,
        String planName,
        Integer planId,
        java.math.BigDecimal amount,
        Integer validityDays,
        java.time.LocalDate validUntil
) {
    public static CustomerSummary from(Customer c) {
        if (c.getCurrentPlan() == null) {
            return new CustomerSummary(c.getCustomerName(), c.getCustomerNumber(), "No active plan", null, null, null, c.getValidUntil());
        }
        var p = c.getCurrentPlan();
        return new CustomerSummary(c.getCustomerName(), c.getCustomerNumber(), p.getPlanName(), p.getPlanId(), p.getPrice(), p.getValidityDays(), c.getValidUntil());
    }
}
