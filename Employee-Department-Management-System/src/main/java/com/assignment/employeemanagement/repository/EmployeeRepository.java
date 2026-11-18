package com.assignment.employeemanagement.repository;

import com.assignment.employeemanagement.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Spring Data creates the SQL from the method name.
    List<Employee> findByDepartmentId(Long departmentId);

    List<Employee> findBySalaryGreaterThan(BigDecimal salary);

    List<Employee> findByNameContainingIgnoreCase(String keyword);

    List<Employee> findBySalaryBetween(BigDecimal minSalary, BigDecimal maxSalary);

    // JPQL uses Java entity/property names, not table/column names.
    @Query("SELECT e FROM Employee e WHERE LOWER(e.department.name) = LOWER(:departmentName)")
    List<Employee> findEmployeesByDepartmentName(@Param("departmentName") String departmentName);

    // Native query uses actual database table and column names.
    @Query(value = "SELECT * FROM employees WHERE salary >= :minimumSalary", nativeQuery = true)
    List<Employee> findEmployeesWithNativeSalaryFilter(@Param("minimumSalary") BigDecimal minimumSalary);

    // JpaRepository already provides findAll(Pageable) for pagination and sorting.
    Page<Employee> findAll(Pageable pageable);
}
