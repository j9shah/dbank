import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dotenv from 'dotenv';

dotenv.config(); // Initialize dotenv

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// sync the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced successfully.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));