package com.chethan.recharge.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "recharge_plans")
public class RechargePlan {
    @Id
    @Column(name = "plan_id")
    private Integer planId;

    @Column(name = "plan_name", nullable = false, length = 50)
    private String planName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "validity_days", nullable = false)
    private Integer validityDays;

    @Column(length = 255)
    private String benefits;

    @Column(name = "popularity_count", nullable = false)
    private Integer popularityCount = 0;

    public Integer getPlanId() { return planId; }
    public void setPlanId(Integer planId) { this.planId = planId; }
    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getValidityDays() { return validityDays; }
    public void setValidityDays(Integer validityDays) { this.validityDays = validityDays; }
    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    public Integer getPopularityCount() { return popularityCount; }
    public void setPopularityCount(Integer popularityCount) { this.popularityCount = popularityCount; }
}
