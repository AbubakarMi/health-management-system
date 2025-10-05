# PostgreSQL Database Setup Guide

## 📦 Installed Packages

All required packages are already installed:
- ✅ `pg` (v8.16.3) - PostgreSQL client for Node.js
- ✅ `sequelize` (v6.37.7) - Promise-based ORM for PostgreSQL
- ✅ `dotenv` (v16.6.1) - Load environment variables from .env file
- ✅ `nodemon` (v3.1.9) - Auto-restart server on file changes (dev)

## 🔧 Configuration

### 1. Install PostgreSQL
Download and install PostgreSQL from: https://www.postgresql.org/download/

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nubenta_care;

# Exit psql
\q
```

### 3. Configure Environment Variables
Update the `.env` file with your PostgreSQL credentials:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/nubenta_care
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nubenta_care
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_DIALECT=postgres
```

**Important:** Replace `your_password_here` with your actual PostgreSQL password.

## 🚀 Initialize Database

Install tsx if not already installed:
```bash
npm install -g tsx
```

Run the database initialization script:
```bash
npx tsx scripts/init-db.ts
```

This will:
1. Test the database connection
2. Initialize all models
3. Create database tables automatically

## 📁 Project Structure

```
src/
├── lib/
│   └── db.ts              # Database connection & configuration
├── models/
│   ├── index.ts           # Model exports & initialization
│   ├── User.ts            # User model (admin, doctor, etc.)
│   └── Patient.ts         # Patient model
scripts/
└── init-db.ts             # Database initialization script
```

## 📊 Database Models

### User Model
- **Fields**: id, email, password, firstName, lastName, role, phone, isActive
- **Roles**: admin, doctor, pharmacist, finance, labtech

### Patient Model
- **Fields**: id, firstName, lastName, email, phone, dateOfBirth, gender, address, bloodGroup, emergencyContact, emergencyPhone, condition, isAdmitted, roomNumber

## 🔄 Using Sequelize

### Example: Create a User
```typescript
import { User } from '@/models';

const newUser = await User.create({
  email: 'admin@nubenta.com',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'admin',
  phone: '+234123456789'
});
```

### Example: Find Patients
```typescript
import { Patient } from '@/models';

// Find all admitted patients
const admittedPatients = await Patient.findAll({
  where: { isAdmitted: true }
});

// Find critical patients
const criticalPatients = await Patient.findAll({
  where: { condition: 'Critical' }
});
```

## 🛠️ Useful Commands

```bash
# Test database connection
npx tsx -e "import('./src/lib/db').then(m => m.testConnection())"

# Sync database (create/update tables)
npx tsx scripts/init-db.ts

# Run development server with nodemon
npm run dev
```

## 📚 Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pg npm package](https://www.npmjs.com/package/pg)

## ⚠️ Important Notes

1. **Never commit .env file** - Keep your database credentials secure
2. **Use migrations** - For production, consider using Sequelize migrations
3. **Password hashing** - Always hash passwords before storing (use bcrypt)
4. **Validation** - Models include basic validation, add more as needed

## 🔐 Security Best Practices

- Use strong database passwords
- Enable SSL for production databases
- Implement proper authentication and authorization
- Use parameterized queries (Sequelize handles this)
- Regular database backups
- Limit database user permissions

---

**Powered by [Nubenta Technology Limited](https://nubenta.com)**
