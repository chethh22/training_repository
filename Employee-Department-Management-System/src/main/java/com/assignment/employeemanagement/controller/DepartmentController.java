
package com.assignment.employeemanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assignment.employeemanagement.dto.DepartmentRequest;
import com.assignment.employeemanagement.dto.DepartmentResponse;
import com.assignment.employeemanagement.service.DepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // CREATE department
    @PostMapping
    public ResponseEntity<DepartmentResponse> create(
            @Valid @RequestBody DepartmentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departmentService.create(request));
    }

    // GET all departments
    @GetMapping
    public List<DepartmentResponse> getAll() {

        return departmentService.getAll();
    }

    // GET department by ID
    @GetMapping("/{id}")
    public DepartmentResponse getById(@PathVariable Long id) {

        return departmentService.getById(id);
    }

    // UPDATE department
    @PutMapping("/{id}")
    public DepartmentResponse update(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {

        return departmentService.update(id, request);
    }
}
