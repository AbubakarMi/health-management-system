import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

// Patient attributes interface
interface PatientAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  condition?: 'Stable' | 'Critical' | 'Recovering';
  isAdmitted: boolean;
  roomNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface PatientCreationAttributes extends Optional<PatientAttributes, 'id' | 'isAdmitted' | 'createdAt' | 'updatedAt'> {}

// Patient model class
class Patient extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email?: string;
  public phone!: string;
  public dateOfBirth!: Date;
  public gender!: 'Male' | 'Female' | 'Other';
  public address!: string;
  public bloodGroup?: string;
  public emergencyContact?: string;
  public emergencyPhone?: string;
  public condition?: 'Stable' | 'Critical' | 'Recovering';
  public isAdmitted!: boolean;
  public roomNumber?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Patient model
Patient.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address',
        },
      },
      set(value: string) {
        // Don't validate empty strings
        this.setDataValue('email', value === '' ? null : value);
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condition: {
      type: DataTypes.ENUM('Stable', 'Critical', 'Recovering'),
      allowNull: true,
    },
    isAdmitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'patients',
    timestamps: true,
  }
);

export default Patient;
