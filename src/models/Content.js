import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'general',
  },
  // JSON field for storing all content data
  data: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  // JSON field for storing additional metadata
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'contents',
  timestamps: true,
});

export default Content;

