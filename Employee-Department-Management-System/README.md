# Employee & Department Management System

Beginner-to-intermediate REST API built with Java 21, Spring Boot 3.5, Spring Data JPA, Hibernate and MySQL.

## 1. Prerequisites

- JDK 21
- MySQL Server 8+
- IntelliJ IDEA or VS Code
- Postman
- Maven (or use the Maven wrapper if one is added by your IDE)

Check Java: `java -version`

## 2. Database setup

Start MySQL and run:

```sql
CREATE DATABASE employee_management;
```

Open `src/main/resources/application.properties` and update the username/password.
Defaults in this project are `root` / `root`. Prefer environment variables for real projects:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

The application uses `spring.jpa.hibernate.ddl-auto=update` for this learning assignment. Hibernate creates the `departments` and `employees` tables based on the entities. In production, use database migration tools such as Flyway or Liquibase instead.

## 3. Run the application

From the project root:

```bash
mvn spring-boot:run
```

Or in IntelliJ/VS Code, run `EmployeeDepartmentManagementApplication.java`.

Base URL: `http://localhost:8080`

## 4. API endpoints

### Departments

| Method | URL | Purpose |
|---|---|---|
| POST | `/api/departments` | Create department |
| GET | `/api/departments` | Get all departments |
| GET | `/api/departments/{id}` | Department details including employees |

Create department body:

```json
{
  "name": "Engineering",
  "description": "Builds and maintains software"
}
```

### Employees

| Method | URL | Purpose |
|---|---|---|
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{id}` | Get employee by ID |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| PUT | `/api/employees/{employeeId}/department` | Assign employee to department |
| GET | `/api/employees/department/{departmentId}` | Employees in a department |
| GET | `/api/employees/search/salary-greater-than?amount=50000` | Salary greater than |
| GET | `/api/employees/search/name?keyword=an` | Name contains keyword |
| GET | `/api/employees/search/salary-between?min=30000&max=70000` | Salary range |
| GET | `/api/employees/search/department-name?name=Engineering` | JPQL query |
| GET | `/api/employees/search/native-salary?min=50000` | Native SQL query |
| GET | `/api/employees/page?page=0&size=5&sortBy=salary&direction=desc` | Pagination and sorting |

Employee request body:

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "salary": 65000
}
```

Assign department body:

```json
{
  "departmentId": 1
}
```

## 5. Suggested Postman test sequence

1. Create a department (POST `/api/departments`).
2. Create two or more employees (POST `/api/employees`).
3. Assign each employee to the department (PUT `/api/employees/1/department`).
4. Get all employees and get employee by ID.
5. Get department by ID and confirm employees appear in its response.
6. Update an employee.
7. Test department employee search.
8. Test salary greater-than, name contains and salary-between filters.
9. Test JPQL department-name and native salary endpoints.
10. Test pagination and sorting.
11. Delete an employee, then GET that ID to verify 404.
12. Try invalid email/blank name and a missing department ID to test error handling.

## 6. Important implementation notes

- `Employee` is the owning side of the relationship: `@ManyToOne` plus `@JoinColumn(name = "department_id")` creates the foreign key.
- `Department` is the inverse side: `@OneToMany(mappedBy = "department")`.
- DTOs prevent exposing entities directly and avoid recursive JSON caused by bidirectional relationships.
- `JpaRepository` provides `save`, `findAll`, `findById`, `delete`, and paging support.
- Derived query names such as `findBySalaryGreaterThan` are translated into SQL by Spring Data JPA.
- JPQL uses entity/property names (`Employee`, `department.name`); native SQL uses database table/column names (`employees`, `salary`).
- `@Valid` triggers request-body validation; `@RestControllerAdvice` centralizes error responses.

## 7. Important HTTP statuses

- `201 Created`: employee/department created
- `200 OK`: successful GET/PUT
- `204 No Content`: successful DELETE
- `400 Bad Request`: invalid request data
- `404 Not Found`: requested employee/department does not exist
- `409 Conflict`: duplicate unique database value
- `500 Internal Server Error`: unexpected server-side error
