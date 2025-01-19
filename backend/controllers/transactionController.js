import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { io } from '../server.js';

// helper function to extract userId from token
const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('Token missing');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// deposit
export const deposit = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount!' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.balance = parseFloat(user.balance) + parseFloat(amount);
    await user.save();

    const transaction = await Transaction.create({
      userId,
      type: 'deposit',
      amount,
      details: 'Deposit',
      senderRecipient: 'N/A',
    });

    res.status(201).json({
      message: 'Deposit successful',
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    console.error('Error during deposit:', error);
    res.status(500).json({ message: 'Deposit failed', error: error.message });
  }
};

// withdraw
export const withdraw = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount!' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (parseFloat(user.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance = parseFloat(user.balance) - parseFloat(amount);
    await user.save();

    const transaction = await Transaction.create({
      userId,
      type: 'withdrawal',
      amount: -Math.abs(amount),
      details: 'Withdrawal',
      senderRecipient: 'N/A',
    });

    res.status(201).json({
      message: 'Withdrawal successful',
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    console.error('Error during withdrawal:', error);
    res.status(500).json({ message: 'Withdrawal failed', error: error.message });
  }
};

// transfer
export const transfer = async (req, res) => {
  try {
    const senderId = getUserIdFromToken(req);
    const { recipientEmail, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer amount!' });
    }

    const sender = await User.findByPk(senderId);
    const recipient = await User.findOne({ where: { email: recipientEmail } });

    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (parseFloat(sender.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    sender.balance = parseFloat(sender.balance) - parseFloat(amount);
    recipient.balance = parseFloat(recipient.balance) + parseFloat(amount);

    await sender.save();
    await recipient.save();

    // records sender's transaction
    await Transaction.create({
      userId: senderId,
      type: 'transfer',
      amount: -amount,
      details: `Transfer to ${recipient.username}`,
      senderRecipient: recipient.username,
      isCredit: false,
    });

    // records recipient's transaction
    await Transaction.create({
      userId: recipient.id,
      type: 'transfer',
      amount,
      details: `Received from ${sender.username}`,
      senderRecipient: sender.username,
      isCredit: true,
    });

    io.emit('transaction', {
      type: 'transfer',
      senderId,
      recipientId: recipient.id,
      amount,
    });

    res.status(201).json({
      message: 'Transfer successful',
      senderBalance: sender.balance,
      recipientBalance: recipient.balance,
    });
  } catch (error) {
    console.error('Error during transfer:', error);
    res.status(500).json({ message: 'Transfer failed', error: error.message });
  }
};

// fetches transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'type', 'amount', 'details', 'isCredit', 'senderRecipient', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    console.log("Fetched Transactions:", transactions); // Log transactions here
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};