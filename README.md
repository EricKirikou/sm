# SUKUU Backend API Documentation

Welcome to the SUKUU Backend API documentation. This guide provides details on how to interact with the backend services for managing students, employees, exams, and payrolls.

## Base URL
All API endpoints are relative to the following base URL:
https://sukuu-backend.onrender.com/

## MongoDB Connection
The MongoDB connection string for the database is:
mongodb+srv://erickirikou:pYiRPzLGhrIcQgtb@cluster0.9nlawri.mongodb.net/sukuu


---

## API Endpoints

### Admin and Other Users
- *Login*  
  POST /v1/api/auth/login
  Login to the platform



### Students
- *Add a Student*  
  POST /v1/api/student/add  
  Add a new student to the database.

- *Get a Student*  
  GET /v1/api/student/:id  
  Retrieve details of a specific student by their ID.

- *Get All Students*  
  GET /v1/api/student/  
  Retrieve a list of all students.

- *Edit a Student*  
  PUT /v1/api/student/edit/:id  
  Update details of a specific student by their ID.

- *Delete a Student*  
  DELETE /v1/api/student/delete/:id  
  Delete a student from the database by their ID.

---

### Employees
- *Add an Employee*  
  POST /v1/api/employee/add  
  Add a new employee to the database.

- *Get an Employee*  
  GET /v1/api/employee/:id  
  Retrieve details of a specific employee by their ID.

- *Get All Employees*  
  GET /v1/api/employee/  
  Retrieve a list of all employees.

- *Edit an Employee*  
  PUT /v1/api/employee/edit/:id  
  Update details of a specific employee by their ID.

- *Delete an Employee*  
  DELETE /v1/api/employee/delete/:id  
  Delete an employee from the database by their ID.

---

### Exams
- *Add an Exam*  
  POST /v1/api/exams/add  
  Add a new exam to the database.

- *Get an Exam*  
  GET /v1/api/exams/:id  
  Retrieve details of a specific exam by its ID.

- *Get All Exams*  
  GET /v1/api/exams/  
  Retrieve a list of all exams.

- *Edit an Exam*  
  PUT /v1/api/exams/edit/:id  
  Update details of a specific exam by its ID.

- *Delete an Exam*  
  DELETE /v1/api/exams/delete/:id  
  Delete an exam from the database by its ID.

---

### Payroll
- *Add a Payroll*  
  POST /v1/api/payroll/add  
  Add a new payroll to the database.

- *Get a Payroll*  
  GET /v1/api/payroll/:id  
  Retrieve details of a specific payroll by its ID.

- *Get All Payrolls*  
  GET /v1/api/payroll/  
  Retrieve a list of all payrolls.

- *Edit a Payroll*  
  PUT /v1/api/payroll/edit/:id  
  Update details of a specific payroll by its ID.

- *Delete a Payroll*  
  DELETE /v1/api/payroll/delete/:id  
  Delete a payroll from the database by its ID.

---

## Notes
- Replace :id in the URLs with the actual ID of the resource you are interacting with.
- Ensure all requests are properly authenticated if applicable.
- For POST and PUT requests, include the required data in the request body.

---
