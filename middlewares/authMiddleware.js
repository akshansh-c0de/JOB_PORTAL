import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';

/**
 * Middleware to check if user is logged in
 * We check if the 'Authorization' header exists and has a valid token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // The header usually looks like: Authorization: Bearer your_token_here
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorHandler('You need to login to access this!', 401));
    }

    // Decoding the token to get the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Finding user in DB and attaching it to the request object
    // So we can use req.user in any controller
    req.user = await User.findById(decodedToken.id);

    if (!req.user) {
      return next(new ErrorHandler('User not found with this token', 404));
    }

    next();
  } catch (err) {
    // If token is invalid or expired
    return next(new ErrorHandler('Not authorized, token failed or expired', 401));
  }
};

/**
 * Middleware to restrict access to specific roles
 * Example: Only 'recruiter' can post a job
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is in the allowed list
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Permission Denied: Only ${roles} can do this`, 403));
    }
    next();
  };
};
