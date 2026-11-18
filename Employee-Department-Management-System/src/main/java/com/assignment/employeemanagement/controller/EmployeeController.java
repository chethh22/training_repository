package com.assignment.employeemanagement.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.assignment.employeemanagement.dto.AssignDepartmentRequest;
import com.assignment.employeemanagement.dto.EmployeeRequest;
import com.assignment.employeemanagement.dto.EmployeeResponse;
import com.assignment.employeemanagement.service.EmployeeService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;

@RestController
@RequestMapping("/api/employees")
@Validated // Enables validation on query parameters as well as request bodies.
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.create(request));
    }

    @GetMapping
    public List<EmployeeResponse> getAll() {
        return employeeService.getAll();
    }

    @GetMapping("/{id}")
    public EmployeeResponse getById(@PathVariable Long id) {
        return employeeService.getById(id);
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return employeeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.noContent().build(); // HTTP 204 means deleted successfully, no response body.
    }

    @PutMapping("/{employeeId}/department")
    public EmployeeResponse assignDepartment(@PathVariable Long employeeId, @Valid @RequestBody AssignDepartmentRequest request) {
        return employeeService.assignDepartment(employeeId, request.getDepartmentId());
    }

    @GetMapping("/department/{departmentId}")
    public List<EmployeeResponse> byDepartment(@PathVariable Long departmentId) {
        return employeeService.byDepartment(departmentId);
    }

    @GetMapping("/search/salary-greater-than")
    public List<EmployeeResponse> salaryGreaterThan(
            @RequestParam @DecimalMin("0.0") BigDecimal amount) {
        return employeeService.salaryGreaterThan(amount);
    }

    @GetMapping("/search/name")
    public List<EmployeeResponse> nameContains(@RequestParam String keyword) {
        return employeeService.nameContains(keyword);
    }

    @GetMapping("/search/salary-between")
    public List<EmployeeResponse> salaryBetween(@RequestParam BigDecimal min,
                                                @RequestParam BigDecimal max) {
        return employeeService.salaryBetween(min, max);
    }

    @GetMapping("/search/department-name")
    public List<EmployeeResponse> byDepartmentName(@RequestParam String name) {
        return employeeService.byDepartmentName(name);
    }

    @GetMapping("/search/native-salary")
    public List<EmployeeResponse> nativeSalaryFilter(@RequestParam BigDecimal min) {
        return employeeService.nativeSalaryFilter(min);
    }

    @GetMapping("/page")
    public Page<EmployeeResponse> page(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return employeeService.getPage(page, size, sortBy, direction);
    }
}
