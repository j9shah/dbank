import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const deposit = async (req, res) => {
  const { userId, amount } = req.body;

  // validates the amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid deposit amount' });
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

export const withdraw = async (req, res) => {
  const { userId, amount } = req.body;

  // validates the amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid withdrawal amount' });
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