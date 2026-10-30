package com.chethan.recharge.repository;

import com.chethan.recharge.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByCustomerNumber(String customerNumber);
    List<Customer> findByValidUntilBetweenOrderByValidUntilAsc(LocalDate start, LocalDate end);
}
