import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface LabTestAttributes {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  testType: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dateOrdered: Date;
  dateCompleted?: Date;
  results?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LabTestCreationAttributes extends Optional<LabTestAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class LabTest extends Model<LabTestAttributes, LabTestCreationAttributes> implements LabTestAttributes {
  public id!: string;
  public patientId!: string;
  public patientName!: string;
  public doctorName!: string;
  public testType!: string;
  public status!: 'Pending' | 'In Progress' | 'Completed';
  public dateOrdered!: Date;
  public dateCompleted?: Date;
  public results?: string;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LabTest.init(
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
    testType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    dateOrdered: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateCompleted: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    results: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'lab_tests',
    timestamps: true,
  }
);

export default LabTest;
