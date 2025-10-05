# 🚀 Nubenta Care - Complete API Documentation

## 📋 Overview

All data in the Nubenta Care system is now saved to **PostgreSQL database**. Every action creates, reads, updates, or deletes records from the database.

**Base URL**: `http://localhost:4005/api`

## 🗄️ Database Tables

1. **users** - System users (admin, doctors, pharmacists, finance, lab technicians)
2. **patients** - Patient records
3. **prescriptions** - Medication prescriptions
4. **lab_tests** - Laboratory test orders and results
5. **invoices** - Billing and payment records
6. **admissions** - Hospital admission records

---

## 👥 Users API

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "doctor",
  "phone": "08012345678",
  "isActive": true
}
```

### Get All Users
```http
GET /api/users
```

---

## 🏥 Patients API

### Create Patient
```http
POST /api/patients
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@email.com",
  "phone": "08012345678",
  "dateOfBirth": "1990-01-15",
  "gender": "Female",
  "address": "123 Main St, Lagos",
  "bloodGroup": "O+",
  "emergencyContact": "John Smith",
  "emergencyPhone": "08087654321",
  "condition": "Stable",
  "isAdmitted": false,
  "roomNumber": null
}
```

### Get All Patients
```http
GET /api/patients
```

### Get Single Patient
```http
GET /api/patients/{id}
```

### Update Patient
```http
PUT /api/patients/{id}
Content-Type: application/json

{
  "condition": "Recovering",
  "isAdmitted": true,
  "roomNumber": "A-101"
}
```

### Delete Patient
```http
DELETE /api/patients/{id}
```

---

## 💊 Prescriptions API

### Create Prescription
```http
POST /api/prescriptions
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "patientName": "Jane Smith",
  "doctorName": "Dr. John Doe",
  "medication": "Amoxicillin",
  "dosage": "500mg",
  "frequency": "3 times daily",
  "duration": "7 days",
  "status": "Pending",
  "dateIssued": "2025-10-04",
  "notes": "Take with food"
}
```

### Get All Prescriptions
```http
GET /api/prescriptions
GET /api/prescriptions?patientId=patient-uuid
GET /api/prescriptions?status=Pending
```

### Get Single Prescription
```http
GET /api/prescriptions/{id}
```

### Update Prescription (Dispense)
```http
PUT /api/prescriptions/{id}
Content-Type: application/json

{
  "status": "Dispensed"
}
```

### Delete Prescription
```http
DELETE /api/prescriptions/{id}
```

---

## 🔬 Lab Tests API

### Create Lab Test
```http
POST /api/lab-tests
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "patientName": "Jane Smith",
  "doctorName": "Dr. John Doe",
  "testType": "Complete Blood Count",
  "status": "Pending",
  "dateOrdered": "2025-10-04",
  "notes": "Fasting required"
}
```

### Get All Lab Tests
```http
GET /api/lab-tests
GET /api/lab-tests?patientId=patient-uuid
GET /api/lab-tests?status=Pending
```

### Get Single Lab Test
```http
GET /api/lab-tests/{id}
```

### Update Lab Test (Add Results)
```http
PUT /api/lab-tests/{id}
Content-Type: application/json

{
  "status": "Completed",
  "dateCompleted": "2025-10-05",
  "results": "WBC: 7.5, RBC: 4.8, Hemoglobin: 14.2"
}
```

### Delete Lab Test
```http
DELETE /api/lab-tests/{id}
```

---

## 💰 Invoices API

### Create Invoice
```http
POST /api/invoices
Content-Type: application/json

{
  "invoiceNumber": "INV-2025-001",
  "patientId": "patient-uuid",
  "patientName": "Jane Smith",
  "amount": 25000.00,
  "status": "Pending",
  "dueDate": "2025-10-10",
  "description": "Consultation and medication",
  "items": [
    {"service": "Doctor Consultation", "amount": 10000},
    {"service": "Medication", "amount": 15000}
  ]
}
```

### Get All Invoices
```http
GET /api/invoices
GET /api/invoices?patientId=patient-uuid
GET /api/invoices?status=Overdue
```

### Get Single Invoice
```http
GET /api/invoices/{id}
```

### Update Invoice (Mark as Paid)
```http
PUT /api/invoices/{id}
Content-Type: application/json

{
  "status": "Paid",
  "paidDate": "2025-10-05"
}
```

### Delete Invoice
```http
DELETE /api/invoices/{id}
```

---

## 🏨 Admissions API

### Create Admission
```http
POST /api/admissions
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "patientName": "Jane Smith",
  "roomNumber": "A-101",
  "bedNumber": "1",
  "admissionDate": "2025-10-04",
  "reason": "Appendicitis surgery",
  "status": "Active",
  "assignedDoctor": "Dr. John Doe",
  "notes": "Post-operative care required"
}
```

### Get All Admissions
```http
GET /api/admissions
GET /api/admissions?patientId=patient-uuid
GET /api/admissions?status=Active
```

### Get Single Admission
```http
GET /api/admissions/{id}
```

### Update Admission (Discharge)
```http
PUT /api/admissions/{id}
Content-Type: application/json

{
  "status": "Discharged",
  "dischargeDate": "2025-10-08"
}
```

### Delete Admission
```http
DELETE /api/admissions/{id}
```

---

## 🔧 Database Initialization

### Initialize All Tables
```http
GET /api/init-db
```

This endpoint will:
- ✅ Test database connection
- ✅ Initialize all models
- ✅ Create all tables automatically
- ✅ Set up database schema

**Response:**
```json
{
  "success": true,
  "message": "Database initialized successfully",
  "tables": [
    "users",
    "patients",
    "prescriptions",
    "lab_tests",
    "invoices",
    "admissions"
  ]
}
```

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Server Error

## 🔐 Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

---

## 🚀 Quick Start

1. **Initialize Database**
   ```bash
   Visit: http://localhost:4005/api/init-db
   ```

2. **Create a Patient**
   ```bash
   curl -X POST http://localhost:4005/api/patients \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "phone": "08012345678",
       "dateOfBirth": "1990-01-01",
       "gender": "Male",
       "address": "Lagos, Nigeria",
       "bloodGroup": "O+"
     }'
   ```

3. **View All Patients**
   ```bash
   curl http://localhost:4005/api/patients
   ```

---

**Powered by [Nubenta Technology Limited](https://nubenta.com)**

All data persists in PostgreSQL database `hospital_db` ✅
