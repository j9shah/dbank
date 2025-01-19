import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { Op } from 'sequelize';

// Register User
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with an initial balance of 0
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      balance: 0,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login User
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get Current User Details
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from validateToken middleware
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email'], // Return only necessary fields
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id.toString().padStart(5, '0'), // Format ID as 5 digits
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Failed to fetch current user' });
  }
};

// Fetch User Balance
export const getBalance = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      balance: parseFloat(user.balance).toFixed(2), // Ensure balance is a stringified decimal
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Error fetching balance', error });
  }
};

// Fetch User Transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      limit: 10,
      order: [['createdAt', 'DESC']], // Return most recent transactions first
    });

    const normalizedTransactions = transactions.map((txn) => ({
      id: txn.id,
      date: txn.createdAt,
      type: txn.type,
      amount: parseFloat(txn.amount).toFixed(2), // Ensure amount is a stringified decimal
    }));

    res.status(200).json({ transactions: normalizedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};