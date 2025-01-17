import express from 'express';
import { deposit } from '../controllers/transactionController.js';

const router = express.Router();

// routes
router.post('/deposit', deposit);

export default router;