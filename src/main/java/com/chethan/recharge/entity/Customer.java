package com.chethan.recharge.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "customer_number", nullable = false, unique = true, length = 15)
    private String customerNumber;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_plan_id")
    private RechargePlan currentPlan;

    @Column(name = "valid_until")
    private LocalDate validUntil;

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }
    public String getCustomerNumber() { return customerNumber; }
    public void setCustomerNumber(String customerNumber) { this.customerNumber = customerNumber; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public RechargePlan getCurrentPlan() { return currentPlan; }
    public void setCurrentPlan(RechargePlan currentPlan) { this.currentPlan = currentPlan; }
    public LocalDate getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }
}
