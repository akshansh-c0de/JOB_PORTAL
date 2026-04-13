import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './config/db.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

// Importing routes
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

// Basic config setup
dotenv.config();
const app = express();
const PORT_NUMBER = process.env.PORT || 5000;

// Essential Middlewares
app.use(express.json()); // To parse JSON data from frontend/postman
app.use(cors()); // To allow frontend to talk to backend

// Connecting to MongoDB
// I created a separate file in config folder to keep server.js clean
connectDatabase();

// Main Routes
// Note: Handlers should be defined before the error middleware, 
// otherwise the errors won't be caught properly!
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);

// Simple Welcome Route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to our Job Portal Project!</h1><p>The server is up and running successfully.</p>');
});

// Error handling middleware should always be at the bottom
app.use(errorMiddleware);

app.listen(PORT_NUMBER, () => {
  console.log(`Server started on port ${PORT_NUMBER}. Ready for requests!`);
});
