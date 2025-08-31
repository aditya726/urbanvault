import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';

// --- Initial Configuration ---
dotenv.config();
const app = express();

// --- Database Connection ---
connectDB();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Urban Vault API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

