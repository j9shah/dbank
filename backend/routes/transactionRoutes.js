import express from 'express';
import { deposit, withdraw, transfer} from '../controllers/transactionController.js';

const router = express.Router();

// routes
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);

export default router;