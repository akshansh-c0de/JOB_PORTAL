import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';

/**
 * Middleware to check if the user is logged in (Authentication)
 */
export const protect = async (req, res, next) => {
  let userToken;

  // We look for the token in the 'Authorization' header
  // It usually looks like: Bearer [token_string]
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    userToken = authHeader.split(' ')[1]; // Get the token part after the space
  }

  // If no token was found
  if (!userToken) {
    return next(new ErrorHandler('Login required to access this resource', 401));
  }

  try {
    // 1. Verify if the token is valid (matches our secret key)
    const decodedData = jwt.verify(userToken, process.env.JWT_SECRET);

    // 2. Find the user in DB based on the ID stored in the token
    const user = await User.findById(decodedData.id);

    if (!user) {
      return next(new ErrorHandler('User not found. Please login again.', 404));
    }

    // 3. Attach the user object to the 'req' so that controllers can use it (e.g., req.user.id)
    req.user = user;

    next(); // Move to the next function/controller
  } catch (error) {
    return next(new ErrorHandler('Session expired or invalid token. Please login again.', 401));
  }
};

/**
 * Middleware to check if user's role is allowed
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the current user's role exists in our allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Access Denied. Only ${allowedRoles.join(' or ')} can access this.`,
          403
        )
      );
    }
    next();
  };
};
