# training_repository

# Mobile Recharge Help Desk

A web-based mobile recharge management application built using Spring Boot, Java, MySQL, HTML, CSS, and JavaScript.

## Overview

The Mobile Recharge Help Desk simplifies mobile recharge operations by providing a web interface for customer registration, recharge management, recharge history, and administrative monitoring.

## Features

- Customer registration
- Mobile recharge management
- Recharge plan and transaction management
- Recharge history tracking
- Admin dashboard with customer and recharge summaries
- Centralized exception handling
- MySQL database integration

## Technology Stack

| Technology | Purpose |
|---|---|
| Java | Backend programming |
| Spring Boot | Application framework |
| Spring Data JPA | Database operations |
| MySQL | Database management |
| HTML | Web page structure |
| CSS | Styling and layout |
| JavaScript | Frontend interactions |
| Maven | Dependency management and build |

## Project Structure

```text
MobileRechargeDesk_SpringBoot/
├── database/
│   └── mobile_recharge.sql
├── docs/
│   └── HLD.md
├── src/
│   └── main/
│       ├── java/com/chethan/recharge/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/
│       │   ├── repository/
│       │   ├── service/
│       │   └── MobileRechargeDeskApplication.java
│       └── resources/
│           ├── application.properties
│           ├── data.sql
│           └── static/
├── pom.xml
└── README.md
```

## Prerequisites

- Java JDK compatible with the project configuration
- MySQL Server
- Maven, or the Maven Wrapper if included

## Setup and Execution

1. Clone this repository.
2. Create or configure the MySQL database.
3. Update the database connection settings in `src/main/resources/application.properties`.
4. Ensure the configured database credentials match your local MySQL setup.
5. Run the application using Maven:

   ```bash
   mvn spring-boot:run
   ```

6. Open the local application URL displayed in the console.

## Learning Objectives

This project demonstrates layered application architecture, REST API development, dependency injection, database integration, and frontend-backend communication using Spring Boot.

## Author

Chethan Jadav M.