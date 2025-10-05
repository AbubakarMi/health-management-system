import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface AdmissionAttributes {
  id: string;
  patientId: string;
  patientName: string;
  roomNumber: string;
  bedNumber?: string;
  admissionDate: Date;
  dischargeDate?: Date;
  reason: string;
  status: 'Active' | 'Discharged';
  assignedDoctor?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdmissionCreationAttributes extends Optional<AdmissionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Admission extends Model<AdmissionAttributes, AdmissionCreationAttributes> implements AdmissionAttributes {
  public id!: string;
  public patientId!: string;
  public patientName!: string;
  public roomNumber!: string;
  public bedNumber?: string;
  public admissionDate!: Date;
  public dischargeDate?: Date;
  public reason!: string;
  public status!: 'Active' | 'Discharged';
  public assignedDoctor?: string;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Admission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bedNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admissionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dischargeDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Discharged'),
      allowNull: false,
      defaultValue: 'Active',
    },
    assignedDoctor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'admissions',
    timestamps: true,
  }
);

export default Admission;
