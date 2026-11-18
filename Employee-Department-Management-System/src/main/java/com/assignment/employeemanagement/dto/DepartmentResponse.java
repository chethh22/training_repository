package com.assignment.employeemanagement.dto;

import java.util.List;

public record DepartmentResponse(
        Long id,
        String name,
        String description,
        List<EmployeeResponse> employees
) {}
