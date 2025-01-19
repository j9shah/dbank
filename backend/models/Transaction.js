import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  userId: {     // user ID who initiated the transaction
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {     // type of transaction: deposit, withdrawal, or transfer
    type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer'),
    allowNull: false,
  },
  amount: {     // monetary amount involved in the transaction
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {     // status of the transaction: pending, completed, or failed
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'completed',
  },
  details: {
    type: DataTypes.STRING,
  },
  isCredit: {    // whether the transaction is a credit or debit
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  senderRecipient: {    // user ID of the sender or recipient in a transfer transaction
    type: DataTypes.STRING,
    defaultValue: 'N/A',
  },
});

export default Transaction;