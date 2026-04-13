import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';

// This function sends a cookie or token but we are using JSON response for now
// Keeping it simple for the frontend to handle easily
const createAndSendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  res.status(statusCode).json({
    success: true,
    message: 'Logged in successfully',
    token: token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email
    }
  });
};

// Register Handler
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists in DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler('User with this email already exists', 400));
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role
    });

    createAndSendToken(newUser, 201, res);
  } catch (error) {
    // If something goes wrong with the DB or validation
    next(error);
  }
};

// Login Handler
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password are provided
    if (!email || !password) {
      return next(new ErrorHandler('Please provide both email and password', 400));
    }

    // 2. Find user and include password (it's hidden by default in schema)
    const userInDb = await User.findOne({ email }).select('+password');

    if (!userInDb) {
      return next(new ErrorHandler('No user found with this email', 401));
    }

    // 3. Verify if password matches using the method we wrote in User model
    const isPasswordMatched = await userInDb.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    // 4. Everything is correct, send the token
    createAndSendToken(userInDb, 200, res);

  } catch (error) {
    next(error);
  }
};

// Simple profile route to check current user details
export const getMe = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user: currentUser
    });
  } catch (error) {
    next(error);
  }
};
