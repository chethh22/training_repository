package com.chethan.recharge.service;
import com.chethan.recharge.dto.RegisterCustomerRequest;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chethan.recharge.dto.AdminDashboard;
import com.chethan.recharge.dto.CustomerSummary;
import com.chethan.recharge.dto.HistoryItem;
import com.chethan.recharge.dto.RechargeRequest;
import com.chethan.recharge.dto.RechargeResponse;
import com.chethan.recharge.entity.Customer;
import com.chethan.recharge.entity.RechargeHistory;
import com.chethan.recharge.entity.RechargePlan;
import com.chethan.recharge.exception.ApiException;
import com.chethan.recharge.repository.CustomerRepository;
import com.chethan.recharge.repository.RechargeHistoryRepository;
import com.chethan.recharge.repository.RechargePlanRepository;

@Service
public class RechargeService {
    private final RechargePlanRepository planRepository;
    private final CustomerRepository customerRepository;
    private final RechargeHistoryRepository historyRepository;

    public RechargeService(RechargePlanRepository planRepository,
                           CustomerRepository customerRepository,
                           RechargeHistoryRepository historyRepository) {
        this.planRepository = planRepository;
        this.customerRepository = customerRepository;
        this.historyRepository = historyRepository;
    }

    public List<RechargePlan> getPlans() { return planRepository.findAllByOrderByPriceAsc(); }
    public List<RechargePlan> getPopularPlans() { return planRepository.findTop5ByOrderByPopularityCountDesc(); }

    public CustomerSummary getCustomer(String number) {
        return CustomerSummary.from(findCustomer(number));
    }

    public List<HistoryItem> getHistory(String number) {
        findCustomer(number);
        return historyRepository.findTop10ByCustomerNumberOrderByRechargeDateDesc(number)
                .stream().map(HistoryItem::from).toList();
    }

    public List<CustomerSummary> getExpiringCustomers(int days) {
        LocalDate today = LocalDate.now();
        return customerRepository.findByValidUntilBetweenOrderByValidUntilAsc(today, today.plusDays(days))
                .stream().map(CustomerSummary::from).toList();
    }
    public AdminDashboard getAdminDashboard() {
    long totalCustomers = customerRepository.count();
    long totalRecharges = historyRepository.count();

    Double revenue = historyRepository.getTotalRevenue();
    double totalRevenue = revenue == null ? 0.0 : revenue;

    List<RechargePlan> plans = planRepository.findAll();

    String mostPopularPlan = plans.stream()
            .max((p1, p2) -> Integer.compare(
                    p1.getPopularityCount(),
                    p2.getPopularityCount()
            ))
            .map(RechargePlan::getPlanName)
            .orElse("No data");

    long expiringCustomers = getExpiringCustomers(7).size();

    return new AdminDashboard(
            totalCustomers,
            totalRecharges,
            totalRevenue,
            mostPopularPlan,
            expiringCustomers
    );
}

    @Transactional
    public RechargeResponse recharge(RechargeRequest request) {
        String number = request.getCustomerNumber().trim();
        Customer customer = findCustomer(number);
        RechargePlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ApiException("Plan ID " + request.getPlanId() + " was not found."));

        LocalDate validUntil = LocalDate.now().plusDays(plan.getValidityDays());
        customer.setCurrentPlan(plan);
        customer.setValidUntil(validUntil);
        customerRepository.save(customer);

        RechargeHistory history = new RechargeHistory();
        history.setCustomerNumber(number);
        history.setPlan(plan);
        history.setRechargeDate(LocalDate.now());
        history.setAmount(plan.getPrice());
        historyRepository.save(history);

        plan.setPopularityCount((plan.getPopularityCount() == null ? 0 : plan.getPopularityCount()) + 1);
        planRepository.save(plan);

        return new RechargeResponse(
                "Recharge successful",
                customer.getCustomerName(),
                number,
                plan.getPlanName(),
                plan.getPrice(),
                plan.getValidityDays(),
                validUntil
        );
    }
    public Customer registerCustomer(RegisterCustomerRequest request) {

    String number = request.customerNumber().trim();
    String name = request.customerName().trim();

    if (customerRepository.findByCustomerNumber(number).isPresent()) {
        throw new ApiException("Customer number is already registered.");
    }

    Customer customer = new Customer();
    customer.setCustomerNumber(number);
    customer.setCustomerName(name);

    return customerRepository.save(customer);
}

    private Customer findCustomer(String number) {
        return customerRepository.findByCustomerNumber(number)
                .orElseThrow(() -> new ApiException("Customer number " + number + " was not found."));
    }
}
