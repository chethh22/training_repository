package com.chethan.recharge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.chethan.recharge.entity.RechargeHistory;

public interface RechargeHistoryRepository extends JpaRepository<RechargeHistory, Integer> {

    List<RechargeHistory> findTop10ByCustomerNumberOrderByRechargeDateDesc(String customerNumber);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM RechargeHistory r")
    Double getTotalRevenue();
}