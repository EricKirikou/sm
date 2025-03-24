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

  Request Payload (to backend):

  json
  {
    "username": "marquingyase",
    "password": "yourpassword"
  }
  

  Response (from backend):

  json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "admin"
    }
  }
  

### Students

- *Add a Student*  
  POST /v1/api/student/add  
  Add a new student to the database.

  Request Payload (to backend):

  json
  {
    "firstName": "marquin",
    "otherName": "",
    "lastName": "gyase",
    "dateOfAdmission": "2000-01-01",
    "classGroup": "1A",
    "registrationID": "ST294649",
    "mobileNumber": "123456789",
    "gender": "male",
    "dateOfBirth": "1999-09-09",
    "fatherName": "marquin pque",
    "fatherNumber": "123456789",
    "motherName": "mama qpue",
    "motherNumber": "987654321",
    "medicalCondition": "no",
    "studentFormID": "ST25166",
    "password": "securepassword"
  }
  

  Response (from backend):

  json
  {
    "message": "Student added successfully"
  }
  

- *Get a Student*  
   GET /v1/api/student/:id  
   Retrieve details of a specific student by their ID.

  Response (from backend):

  json
  {
    "_id": "616449462898944e84",
    "username": "marquingyase",
    "firstName": "marquin",
    "otherName": "",
    "lastName": "gyase",
    "dateOfAdmission": "2000-01-01",
    "classGroup": "1A",
    "registrationID": "ST294649",
    "mobileNumber": "123456789",
    "gender": "male",
    "dateOfBirth": "1999-09-09",
    "fatherName": "marquin pque",
    "fatherNumber": "123456789",
    "motherName": "mama qpue",
    "motherNumber": "987654321",
    "medicalCondition": "no",
    "studentFormID": "ST25166",
    "createdAt": "2025-25-06",
    "updatedAt": "2025-30-06"
  }
  

- *Get All Students*
  GET /v1/api/student/
  Retrieve a list of all students.

  Response (from backend)

  json
  [
    {
      "_id": "616449462898944e84",
      "username": "marquingyase",
      "firstName": "marquin",
      "otherName": "",
      "lastName": "gyase",
      "dateOfAdmission": "2000-01-01",
      "classGroup": "1A",
      "registrationID": "ST294649",
      "mobileNumber": "123456789",
      "gender": "male",
      "dateOfBirth": "1999-09-09",
      "fatherName": "marquin pque",
      "fatherNumber": "123456789",
      "motherName": "mama qpue",
      "motherNumber": "987654321",
      "medicalCondition": "no",
      "studentFormID": "ST25166",
      "createdAt": "2025-25-06",
      "updatedAt": "2025-30-06"
    },
    {
      "_id": "687asgdv8f1daf866",
      "username": "marquingyase1",
      "firstName": "marquin",
      "otherName": "",
      "lastName": "gyase",
      "dateOfAdmission": "2000-01-01",
      "classGroup": "1A",
      "registrationID": "ST295649",
      "mobileNumber": "123456789",
      "gender": "male",
      "dateOfBirth": "1999-09-09",
      "fatherName": "marquin pque",
      "fatherNumber": "123456789",
      "motherName": "mama qpue",
      "motherNumber": "987654321",
      "medicalCondition": "yes",
      "studentFormID": "ST25156",
      "createdAt": "2025-25-06",
      "updatedAt": "2025-30-06"
    }
  ]
  

- *Edit a Student*
  PUT /v1/api/student/edit/:id
  Update details of a specific student by their ID.

  Request Payload (to backend):

  json
  {
    "firstName": "marquin",
    "otherName": "",
    "lastName": "gyase",
    "dateOfAdmission": "2000-01-01",
    "classGroup": "1A",
    "registrationID": "ST294649",
    "mobileNumber": "123456789",
    "gender": "male",
    "dateOfBirth": "1999-09-09",
    "fatherName": "marquin pque",
    "fatherNumber": "123456789",
    "motherName": "mama qpue",
    "motherNumber": "987654321",
    "medicalCondition": "no",
    "studentFormID": "ST25166",
    "password": "securepassword"
  }
  

  Response (from backend):

  json
  {
    "message": "Student edited successfully",
    "data": {
      "_id": "616449462898944e84",
      "username": "marquingyase",
      "firstName": "marquin",
      "otherName": "",
      "lastName": "gyase",
      "dateOfAdmission": "2000-01-01",
      "classGroup": "1A",
      "registrationID": "ST294649",
      "mobileNumber": "123456789",
      "gender": "male",
      "dateOfBirth": "1999-09-09",
      "fatherName": "marquin pque",
      "fatherNumber": "123456789",
      "motherName": "mama qpue",
      "motherNumber": "987654321",
      "medicalCondition": "no",
      "studentFormID": "ST25166",
      "createdAt": "2025-25-06",
      "updatedAt": "2025-30-06"
    }
  }
  

- *Delete a Student*
  DELETE /v1/api/student/delete/:id
  Delete a student from the database by their ID.

  Response (from backend):

  json
  {
    "message": "Student deleted successfully"
  }
  

---

### Employees

- *Add an Employee*
  POST /v1/api/employee/add
  Add a new employee to the database.

  Request Payload (to backend):

  json
  {
    "nameOfEmployee": "marquin gyase",
    "mobileNumber": "123789456",
    "dateOfBirth": "1987-01-03",
    "role": "admin",
    "idNumber": "SF651448",
    "monthlySalary": "1000.00",
    "imageOfEmployee": "https://avatar.image.com",
    "legalContactName": "marquis",
    "gender": "male",
    "email": "marquingyase@gmail.com",
    "experience": "5 years",
    "education": "University",
    "address": "456 New St, City, Country",
    "password": "securepassword"
  }
  

  Response (from backend):

  json
  {
    "message": "Employee added successfully"
  }
  

- *Get an Employee*
  GET /v1/api/employee/:id
  Retrieve details of a specific employee by their ID.

  Response (from backend):

  json
  {
    "_id": "616449462898944e84",
    "username": "marquingyase",
    "nameOfEmployee": "marquin gyase",
    "mobileNumber": "123789456",
    "dateOfBirth": "1987-01-03",
    "role": "teacher",
    "idNumber": "SF651448",
    "monthlySalary": "1000.00",
    "imageOfEmployee": "https://avatar.image.com",
    "legalContactName": "marquis",
    "gender": "male",
    "email": "marquingyase@gmail.com",
    "experience": "5 years",
    "education": "University",
    "address": "456 New St, City, Country",
    "createdAt": "2025-25-06",
    "updatedAt": "2025-30-06"
  }
  

- *Get All Employees*
  GET /v1/api/employee/
  Retrieve a list of all employees.

  Response (from backend):

  json
  [
    {
      "_id": "616449462898944e84",
      "username": "marquingyase",
      "nameOfEmployee": "marquin gyase",
      "mobileNumber": "123789456",
      "dateOfBirth": "1987-01-03",
      "role": "teacher",
      "idNumber": "SF651448",
      "monthlySalary": "1000.00",
      "imageOfEmployee": "https://avatar.image.com",
      "legalContactName": "marquis",
      "gender": "male",
      "email": "marquingyase@gmail.com",
      "experience": "5 years",
      "education": "University",
      "address": "456 New St, City, Country",
      "createdAt": "2025-25-06",
      "updatedAt": "2025-30-06"
    },
    {
      "_id": "616449462898944e85",
      "username": "marquingyase4",
      "nameOfEmployee": "marquin gyase",
      "mobileNumber": "123789456",
      "dateOfBirth": "1987-01-03",
      "role": "teacher",
      "idNumber": "SF651448",
      "monthlySalary": "1000.00",
      "imageOfEmployee": "https://avatar.image4.com",
      "legalContactName": "marquis",
      "gender": "male",
      "email": "marquingyase4@gmail.com",
      "experience": "5 years",
      "education": "University",
      "address": "456 New St, City, Country",
      "createdAt": "2025-25-06",
      "updatedAt": "2025-30-06"
    }
  ]
  

- *Edit an Employee*
  PUT /v1/api/employee/edit/:id
  Update details of a specific employee by their ID.

  json
  {
    "nameOfEmployee": "marquin gyase",
    "mobileNumber": "123789456",
    "dateOfBirth": "1987-01-03",
    "role": "teacher",
    "idNumber": "SF651448",
    "monthlySalary": "1000.00",
    "imageOfEmployee": "https://avatar.image.com",
    "legalContactName": "marquis",
    "gender": "male",
    "email": "marquingyase@gmail.com",
    "experience": "5 years",
    "education": "University",
    "address": "456 New St, City, Country"
  }
  

  Response (from backend):

  json
  {
    "message": "Employee edited successfully",
    "data": {
      "_id": "616449462898944e84",
      "username": "marquingyase",
      "nameOfEmployee": "marquin gyase",
      "mobileNumber": "123789456",
      "dateOfBirth": "1987-01-03",
      "role": "teacher",
      "idNumber": "SF651448",
      "monthlySalary": "1000.00",
      "imageOfEmployee": "https://avatar.image.com",
      "legalContactName": "marquis",
      "gender": "male",
      "email": "marquingyase@gmail.com",
      "experience": "5 years",
      "education": "University",
      "address": "456 New St, City, Country",
      "createdAt": "2025-25-06",
      "updatedAt": "2025-30-06"
    }
  }
  

- *Delete an Employee*
  DELETE /v1/api/employee/delete/:id
  Delete an employee from the database by their ID.

  Response (from backend):

  json
  {
    "message": "Employee deleted successfully"
  }
  

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
- For POST and PUT requests, include the required data in the request body.

---

For any questions or issues, please contact the backend team.

```

```