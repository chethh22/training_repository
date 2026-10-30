package com.chethan.recharge.dto;

public record AdminDashboard(
        long totalCustomers,
        long totalRecharges,
        double totalRevenue,
        String mostPopularPlan,
        long expiringCustomers
) {
}