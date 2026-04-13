import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using the URI provided in environment variables.
 * Uses async/await for clean flow and tries to handle initial connection errors.
 */
const connectDB = async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'undefined');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
