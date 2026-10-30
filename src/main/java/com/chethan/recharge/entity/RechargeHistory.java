package com.chethan.recharge.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "recharge_history")
public class RechargeHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recharge_id")
    private Integer rechargeId;

    @Column(name = "customer_number", nullable = false, length = 15)
    private String customerNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = false)
    private RechargePlan plan;

    @Column(name = "recharge_date", nullable = false)
    private LocalDate rechargeDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    public Integer getRechargeId() { return rechargeId; }
    public void setRechargeId(Integer rechargeId) { this.rechargeId = rechargeId; }
    public String getCustomerNumber() { return customerNumber; }
    public void setCustomerNumber(String customerNumber) { this.customerNumber = customerNumber; }
    public RechargePlan getPlan() { return plan; }
    public void setPlan(RechargePlan plan) { this.plan = plan; }
    public LocalDate getRechargeDate() { return rechargeDate; }
    public void setRechargeDate(LocalDate rechargeDate) { this.rechargeDate = rechargeDate; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
