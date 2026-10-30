package com.chethan.recharge.repository;

import com.chethan.recharge.entity.RechargePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RechargePlanRepository extends JpaRepository<RechargePlan, Integer> {
    List<RechargePlan> findAllByOrderByPriceAsc();
    List<RechargePlan> findTop5ByOrderByPopularityCountDesc();
}
