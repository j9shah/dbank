import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { io } from '../server.js';

// deposit
export const deposit = async (req, res) => {
  const { userId, amount } = req.body;

  // validates the amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid deposit amount!' });
  }

  try {
    console.log('Fetching user with ID:', userId);
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current balance:', user.balance);
    user.balance = parseFloat(user.balance) + parseFloat(amount);
    console.log('New balance:', user.balance);

    console.log('Saving user balance...');
    await user.save();

    console.log('Creating transaction record...');
    const transaction = await Transaction.create({
      userId,
      type: 'deposit',
      amount,
    });

    console.log('Transaction created:', transaction);

    // emit real-time notification
    io.emit('transaction', {
      type: 'deposit',
      userId,
      amount,
      balance: user.balance,
      timestamp: transaction.createdAt,
    });

    res.status(201).json({
      message: 'Deposit successful',
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    console.error('Error during deposit:', error);
    res.status(500).json({ message: 'Deposit failed', error: error.message || error });
  }
};

// withdraw
export const withdraw = async (req, res) => {
  const { userId, amount } = req.body;

  // validates the amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid withdrawal amount!' });
  }

  try {
    console.log('Fetching user with ID:', userId);
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current balance:', user.balance);
    if (parseFloat(user.balance) < parseFloat(amount)) {
      console.log('Insufficient balance:', user.balance);
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // updates the user's balance
    user.balance = parseFloat(user.balance) - parseFloat(amount);
    console.log('New balance:', user.balance);
    await user.save();

    // creates a withdrawal transaction
    const transaction = await Transaction.create({
      userId,
      type: 'withdrawal',
      amount,
    });

    console.log('Withdrawal successful:', transaction);

    // emit real-time notification
    io.emit('transaction', {
      type: 'withdrawal',
      userId,
      amount,
      balance: user.balance,
      timestamp: transaction.createdAt,
    });

    res.status(201).json({
      message: 'Withdrawal successful',
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    console.error('Error during withdrawal:', error);
    res.status(500).json({ message: 'Withdrawal failed', error: error.message || error });
  }
};

// transfer
export const transfer = async (req, res) => {
  const { senderId, recipientId, amount } = req.body;

  // validates amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer amount!' });
  }

  try {
    console.log('Fetching sender...');
    const sender = await User.findByPk(senderId);

    if (!sender) {
      console.log('Sender not found:', senderId);
      return res.status(404).json({ message: 'Sender not found' });
    }

    console.log('Fetching recipient...');
    const recipient = await User.findByPk(recipientId);

    if (!recipient) {
      console.log('Recipient not found: ', recipientId);
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // validates sender's balance
    console.log('Sender balance:', sender.balance);
    if (parseFloat(sender.balance) < parseFloat(amount)) {
      console.log('Insufficient balance for sender:', sender.balance);
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // updates sender and recipient balances
    sender.balance = parseFloat(sender.balance) - parseFloat(amount);
    recipient.balance = parseFloat(recipient.balance) + parseFloat(amount);

    console.log('Saving updated balances...');
    await sender.save();
    await recipient.save();

    // records the transaction
    console.log('Creating transaction record...');
    const transaction = await Transaction.create({
      userId: senderId,
      type: 'transfer',
      amount,
      status: 'completed',
    });

    console.log('Transfer successful:', transaction);

    // emit real-time notification
    io.emit('transaction', {
      type: 'transfer',
      senderId,
      recipientId,
      amount,
      timestamp: transaction.createdAt,
    });

    res.status(201).json({
      message: 'Transfer successful',
      senderBalance: sender.balance,
      recipientBalance: recipient.balance,
      transaction,
    });
  } catch (error) {
    console.error('Error during transfer:', error);
    res.status(500).json({ message: 'Transfer failed', error: error.message || error });
  }
};