import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

// Importing all the routes here
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

// This is where we load our secret keys from .env file
dotenv.config();

// Making the connection with MongoDB
connectDB();

const app = express();

/**
 * Middlewares - these run before every request
 */
app.use(express.json()); // This allows us to receive JSON data in req.body
app.use(cors()); // This prevents the 'CORS' error when frontend tries to talk to backend

/**
 * Setting up our API routes
 */
app.use('/api/v1/jobs', jobRoutes); // All job related APIs start with /jobs
app.use('/api/v1/auth', authRoutes); // Auth APIs like login and register
app.use('/api/v1/applications', applicationRoutes); // Job application routes

// Simple welcome route to check if server is alive
app.get('/', (req, res) => {
  res.send('<h1>Welcome to our Job Portal Project!</h1><p>API is running smoothly...</p>');
});

/**
 * This is our global error handler. 
 * If any error happens in our code, it will be caught here.
 */
app.use(errorMiddleware);

// Getting the port from .env or using 5000 as default
const PORT_NUMBER = process.env.PORT || 5000;

const server = app.listen(PORT_NUMBER, () => {
  console.log(`Server started on port ${PORT_NUMBER}. Ready for requests!`);
});

// If there's an error with the database or server, we shut down safely
process.on('unhandledRejection', (err) => {
  console.log('Error Type:', err.name);
  console.log('Error Message:', err.message);
  console.log('Closing server due to unhandled error...');
  server.close(() => {
    process.exit(1);
  });
});
