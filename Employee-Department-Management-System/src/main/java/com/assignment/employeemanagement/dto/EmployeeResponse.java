package com.assignment.employeemanagement.dto;

import java.math.BigDecimal;

// DTO keeps API output separate from the database entity.
public record EmployeeResponse(
        Long id,
        String name,
        String email,
        BigDecimal salary,
        Long departmentId,
        String departmentName
) {}
