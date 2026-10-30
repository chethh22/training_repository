1. Project Overview
Mobile Recharge Desk is a web application for managing mobile recharge plans, customers, validity and recharge history.


2. Technologies
- Frontend: HTML, CSS, JavaScript
- Backend: Java, Spring Boot
- API: REST API
- Database: MySQL
- ORM: Spring Data JPA / Hibernate
- Build Tool: Maven


3. Architecture
Frontend
   ↓
REST API
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL

4. Main Features
- View recharge plans
- Register new customers
- Recharge customers
- Check plan validity
- View recharge history
- Expiring customer report
- Popular plans
- Admin dashboard


5. Database
Database: mobile_recharge
Tables:
customers
recharge_plans
recharge_history

6. Recharge Flow
Select Customer
      ↓
Select Plan
      ↓
Cart
      ↓
Demo Payment
      ↓
Process Recharge
      ↓
Update Customer + Validity
      ↓
Save Recharge History

7. Key APIs
GET  /api/plans
GET  /api/customers/{number}
GET  /api/customers/{number}/history
GET  /api/reports/expiring
POST /api/customers/register
POST /api/recharges
GET  /api/admin/dashboard