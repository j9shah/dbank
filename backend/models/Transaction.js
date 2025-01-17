import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  userId: {       // links transaction to user
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {        // specifies type of transaction
    type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer'),
    allowNull: false,
  },
  amount: {       // transaction amount
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {       // tracks transaction status
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'completed',
  },
});
  
export default Transaction;