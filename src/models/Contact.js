import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // JSON field for storing additional metadata
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  // JSON field for storing form data as JSON
  formData: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'new',
    allowNull: false,
  },
}, {
  tableName: 'contacts',
  timestamps: true,
});

export default Contact;

