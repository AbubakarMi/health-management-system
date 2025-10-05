# 🗄️ Database Setup Complete!

## ✅ What's Been Configured

### 1. **Database Connection**
- PostgreSQL configuration ready
- Connection settings in [.env](.env)
- Database: `hospital_db`
- User: `postgres`
- Password: `root`

### 2. **API Endpoints Created**

#### Patients API
- `POST /api/patients` - Create new patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/[id]` - Get single patient
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient

#### Users API
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users

#### Database Init
- `GET /api/init-db` - Initialize database tables

### 3. **Models Created**
- **User Model**: id, email, password, firstName, lastName, role, phone, isActive
- **Patient Model**: id, firstName, lastName, email, phone, dateOfBirth, gender, address, bloodGroup, emergencyContact, condition, isAdmitted, roomNumber

### 4. **Form Integration**
- Patient creation form now saves to PostgreSQL
- Data persists in database
- Backward compatible with existing system

## 🚀 How to Use

### Step 1: Make sure PostgreSQL is running
```bash
# Check if PostgreSQL service is running
```

### Step 2: Initialize the database tables
Visit: http://localhost:4005/api/init-db

This will:
- Test database connection
- Create all tables automatically
- Set up schema

### Step 3: Create patients
- Go to Admin Dashboard → Add Patient
- Fill in patient details
- Data will be saved to PostgreSQL

### Step 4: View saved data (optional)
```bash
# Connect to your database
psql -U postgres -d hospital_db

# View patients
SELECT * FROM patients;

# View users
SELECT * FROM users;
```

## 📊 Testing the API

### Create a patient via API:
```bash
curl -X POST http://localhost:4005/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "08012345678",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "address": "123 Main St, Lagos",
    "bloodGroup": "O+",
    "emergencyContact": "Jane Doe",
    "emergencyPhone": "08087654321"
  }'
```

### Get all patients:
```bash
curl http://localhost:4005/api/patients
```

## 🔧 Troubleshooting

### Connection Error
If you see database connection errors:
1. Ensure PostgreSQL is running
2. Verify credentials in `.env` file
3. Make sure database `hospital_db` exists

### Create database if needed:
```bash
psql -U postgres
CREATE DATABASE hospital_db;
\q
```

---

**Powered by [Nubenta Technology Limited](https://nubenta.com)**
