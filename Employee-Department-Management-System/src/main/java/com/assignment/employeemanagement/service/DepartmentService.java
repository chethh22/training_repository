
package com.assignment.employeemanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.assignment.employeemanagement.dto.DepartmentRequest;
import com.assignment.employeemanagement.dto.DepartmentResponse;
import com.assignment.employeemanagement.dto.EmployeeResponse;
import com.assignment.employeemanagement.entity.Department;
import com.assignment.employeemanagement.exception.ResourceNotFoundException;
import com.assignment.employeemanagement.repository.DepartmentRepository;

@Service
@Transactional
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeService employeeService;

    public DepartmentService(
            DepartmentRepository departmentRepository,
            EmployeeService employeeService) {

        this.departmentRepository = departmentRepository;
        this.employeeService = employeeService;
    }

    // CREATE department
    public DepartmentResponse create(DepartmentRequest request) {

        if (departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalArgumentException(
                    "Department name already exists");
        }

        Department department = new Department(
                request.getName(),
                request.getDescription()
        );

        return toResponse(departmentRepository.save(department));
    }

    // GET all departments
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAll() {

        return departmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // GET department by ID
    @Transactional(readOnly = true)
    public DepartmentResponse getById(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: " + id));

        return toResponse(department);
    }

    // UPDATE department
    public DepartmentResponse update(
            Long id, DepartmentRequest request) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: " + id));

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        Department updatedDepartment =
                departmentRepository.save(department);

        return toResponse(updatedDepartment);
    }

    // Convert Department entity into DepartmentResponse DTO
    private DepartmentResponse toResponse(Department department) {

        List<EmployeeResponse> employees =
                department.getEmployees()
                        .stream()
                        .map(employee -> new EmployeeResponse(
                                employee.getId(),
                                employee.getName(),
                                employee.getEmail(),
                                employee.getSalary(),
                                department.getId(),
                                department.getName()
                        ))
                        .toList();

        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                employees
        );
    }
}
