package com.assignment.employeemanagement.service;

import com.assignment.employeemanagement.dto.EmployeeRequest;
import com.assignment.employeemanagement.dto.EmployeeResponse;
import com.assignment.employeemanagement.entity.Department;
import com.assignment.employeemanagement.entity.Employee;
import com.assignment.employeemanagement.exception.ResourceNotFoundException;
import com.assignment.employeemanagement.repository.DepartmentRepository;
import com.assignment.employeemanagement.repository.EmployeeRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    // Constructor injection: Spring supplies the required repository objects.
    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    public EmployeeResponse create(EmployeeRequest request) {
        Employee employee = new Employee(request.getName(), request.getEmail(), request.getSalary());
        return toResponse(employeeRepository.save(employee)); // save() inserts a new row.
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {
        return toResponse(getEmployeeOrThrow(id));
    }

    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = getEmployeeOrThrow(id);
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setSalary(request.getSalary());
        // save() updates because this entity already has a database ID.
        return toResponse(employeeRepository.save(employee));
    }

    public void delete(Long id) {
        Employee employee = getEmployeeOrThrow(id);
        employeeRepository.delete(employee);
    }

    public EmployeeResponse assignDepartment(Long employeeId, Long departmentId) {
        Employee employee = getEmployeeOrThrow(employeeId);
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        employee.setDepartment(department); // Sets the owning side; Hibernate writes department_id.
        return toResponse(employeeRepository.save(employee));
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> byDepartment(Long departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Department not found with id: " + departmentId);
        }
        return employeeRepository.findByDepartmentId(departmentId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> salaryGreaterThan(BigDecimal salary) {
        return employeeRepository.findBySalaryGreaterThan(salary).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> nameContains(String keyword) {
        return employeeRepository.findByNameContainingIgnoreCase(keyword).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> salaryBetween(BigDecimal min, BigDecimal max) {
        if (min.compareTo(max) > 0) {
            throw new IllegalArgumentException("minSalary must be less than or equal to maxSalary");
        }
        return employeeRepository.findBySalaryBetween(min, max).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> byDepartmentName(String name) {
        return employeeRepository.findEmployeesByDepartmentName(name).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> nativeSalaryFilter(BigDecimal min) {
        return employeeRepository.findEmployeesWithNativeSalaryFilter(min).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> getPage(int page, int size, String sortBy, String direction) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("page must be >= 0 and size must be between 1 and 100");
        }
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return employeeRepository.findAll(pageable).map(this::toResponse);
    }

    private Employee getEmployeeOrThrow(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    // Convert entity to DTO while the service transaction is active.
    private EmployeeResponse toResponse(Employee employee) {
        Department department = employee.getDepartment();
        return new EmployeeResponse(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getSalary(),
                department == null ? null : department.getId(),
                department == null ? null : department.getName()
        );
    }
}
