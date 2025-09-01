import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';

// --- Initial Configuration ---
dotenv.config();
const app = express();

// --- Database Connection ---
connectDB();

// --- Security Middleware ---
app.use(helmet()); // Set security HTTP headers
app.use(express.json({ limit: '10kb' })); // Body parser, reading data from body into req.body, limit size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS

// --- Rate Limiting ---
const limiter = rateLimit({
  max: 100, // 100 requests from the same IP
  windowMs: 60 * 60 * 1000, // in 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter); // Apply limiter to all routes starting with /api

// --- CORS ---
app.use(cors());

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Urban Vault API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

// --- Custom Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Server Initialization ---
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});