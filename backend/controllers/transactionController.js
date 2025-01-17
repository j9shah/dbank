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