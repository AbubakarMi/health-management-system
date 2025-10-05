// Export all models
export { default as User } from './User';
export { default as Patient } from './Patient';
export { default as Prescription } from './Prescription';
export { default as LabTest } from './LabTest';
export { default as Invoice } from './Invoice';
export { default as Admission } from './Admission';

// Import sequelize instance
import sequelize from '@/lib/db';

// Initialize all models and associations
export async function initializeModels() {
  try {
    // Import all models
    const User = (await import('./User')).default;
    const Patient = (await import('./Patient')).default;
    const Prescription = (await import('./Prescription')).default;
    const LabTest = (await import('./LabTest')).default;
    const Invoice = (await import('./Invoice')).default;
    const Admission = (await import('./Admission')).default;

    // Define associations here if needed
    // Example: User.hasMany(Patient, { foreignKey: 'doctorId' });
    // Example: Patient.belongsTo(User, { foreignKey: 'doctorId' });

    console.log('✅ All models initialized successfully');
    console.log('📋 Available tables: users, patients, prescriptions, lab_tests, invoices, admissions');
  } catch (error) {
    console.error('❌ Error initializing models:', error);
    throw error;
  }
}

export default sequelize;
