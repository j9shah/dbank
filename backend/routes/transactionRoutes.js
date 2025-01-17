import express from 'express';
import { deposit, withdraw} from '../controllers/transactionController.js';

const router = express.Router();

// routes
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);

export default router;