package com.assignment.employeemanagement.dto;

import jakarta.validation.constraints.NotNull;

public class AssignDepartmentRequest {
    @NotNull(message = "Department ID is required")
    private Long departmentId;

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
}
