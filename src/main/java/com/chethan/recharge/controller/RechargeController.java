package com.chethan.recharge.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chethan.recharge.dto.AdminDashboard;
import com.chethan.recharge.dto.CustomerSummary;
import com.chethan.recharge.dto.HistoryItem;
import com.chethan.recharge.dto.RechargeRequest;
import com.chethan.recharge.dto.RechargeResponse;
import com.chethan.recharge.dto.RegisterCustomerRequest;
import com.chethan.recharge.entity.Customer;
import com.chethan.recharge.entity.RechargePlan;
import com.chethan.recharge.service.RechargeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RechargeController {
    private final RechargeService service;

    public RechargeController(RechargeService service) { this.service = service; }

    @GetMapping("/plans")
    public List<RechargePlan> plans() { return service.getPlans(); }

    @GetMapping("/plans/popular")
    public List<RechargePlan> popular() { return service.getPopularPlans(); }

    @GetMapping("/customers/{number}")
    public CustomerSummary customer(@PathVariable String number) { return service.getCustomer(number); }

    @GetMapping("/customers/{number}/history")
    public List<HistoryItem> history(@PathVariable String number) { return service.getHistory(number); }

    @GetMapping("/reports/expiring")
    public List<CustomerSummary> expiring(@RequestParam(defaultValue = "7") int days) { return service.getExpiringCustomers(days); }
    @GetMapping("/admin/dashboard")
public AdminDashboard dashboard() {
    return service.getAdminDashboard();
}
@PostMapping("/customers/register")
public Customer registerCustomer(@Valid @RequestBody RegisterCustomerRequest request) {
    return service.registerCustomer(request);
}

    @PostMapping("/recharges")
    public RechargeResponse recharge(@Valid @RequestBody RechargeRequest request) { return service.recharge(request); }
}
