import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface PrescriptionAttributes {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'Pending' | 'Dispensed' | 'Unavailable';
  dateIssued: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PrescriptionCreationAttributes extends Optional<PrescriptionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Prescription extends Model<PrescriptionAttributes, PrescriptionCreationAttributes> implements PrescriptionAttributes {
  public id!: string;
  public patientId!: string;
  public patientName!: string;
  public doctorName!: string;
  public medication!: string;
  public dosage!: string;
  public frequency!: string;
  public duration!: string;
  public status!: 'Pending' | 'Dispensed' | 'Unavailable';
  public dateIssued!: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Prescription.init(
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
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    medication: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Dispensed', 'Unavailable'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    dateIssued: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'prescriptions',
    timestamps: true,
  }
);

export default Prescription;
