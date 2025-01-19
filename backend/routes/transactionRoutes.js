import express from 'express';
import { deposit, withdraw, transfer, getTransactions} from '../controllers/transactionController.js';
import { validateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes
router.post('/deposit', validateToken, deposit);
router.post('/withdraw', validateToken, withdraw);
router.post('/transfer', validateToken, transfer);
router.post('/getTransactions', validateToken, getTransactions);

export default router;