import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // JSON field for storing capabilities array
  capabilities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  // JSON field for storing all service data
  serviceData: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  // JSON field for storing additional metadata
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'services',
  timestamps: true,
});

export default Service;

