import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  getBalance,
  getTransactions,
} from '../controllers/userController.js';
import { validateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login); 
router.get('/me', validateToken, getCurrentUser); // Current user route
router.get('/balance', validateToken, getBalance); // Route for balance
router.get('/transactions', validateToken, getTransactions); // Route for transactions

export default router;