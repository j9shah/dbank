import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], // minimum length of 6 characters needed
    },
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0, // ensure balance cannot go below 0
    },
  },
});

export default User;