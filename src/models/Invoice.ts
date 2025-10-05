import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface InvoiceAttributes {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: Date;
  paidDate?: Date;
  description: string;
  items?: string; // JSON string of items
  createdAt?: Date;
  updatedAt?: Date;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: string;
  public invoiceNumber!: string;
  public patientId!: string;
  public patientName!: string;
  public amount!: number;
  public status!: 'Paid' | 'Pending' | 'Overdue';
  public dueDate!: Date;
  public paidDate?: Date;
  public description!: string;
  public items?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    patientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Paid', 'Pending', 'Overdue'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paidDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'invoices',
    timestamps: true,
  }
);

export default Invoice;
