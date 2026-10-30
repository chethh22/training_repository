package com.chethan.recharge.dto;

import com.chethan.recharge.entity.RechargeHistory;

import java.math.BigDecimal;
import java.time.LocalDate;

public record HistoryItem(String planName, BigDecimal amount, LocalDate rechargeDate) {
    public static HistoryItem from(RechargeHistory h) {
        return new HistoryItem(h.getPlan().getPlanName(), h.getAmount(), h.getRechargeDate());
    }
}
