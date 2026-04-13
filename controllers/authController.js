import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';

/**
 * Register User
 * This handles creating a new account (Candidate or Recruiter)
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Creating the user in our database
    // The password hashing is done automatically in userModel.js before saving
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    // Generate token for the user so they can login immediately
    const token = newUser.getJWTToken();

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: token,
    });
  } catch (error) {
    // If something goes wrong (like email already exists), pass it to error middleware
    next(error);
  }
};

/**
 * Login User
 * This checks credentials and returns a token
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic check: if email or password is missing in the request
    if (!email || !password) {
      return next(new ErrorHandler('Please provide both email and password', 400));
    }

    // Checking if user exists in the database
    // We use .select('+password') because password is hidden by default in our model
    const userInDb = await User.findOne({ email: email }).select('+password');

    if (!userInDb) {
      return next(new ErrorHandler('User not found. Please check your email.', 401));
    }

    // Checking if the password entered matches the hashed password in database
    const isMatched = await userInDb.comparePassword(password);

    if (!isMatched) {
      return next(new ErrorHandler('Wrong password. Please try again.', 401));
    }

    // If everything is correct, generate and send the token
    const token = userInDb.getJWTToken();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token: token,
      user: {
        id: userInDb._id,
        name: userInDb.name,
        role: userInDb.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get My Profile
 * Fetches data of the person who is currently logged in
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user was added by the 'protect' middleware
    const currentUser = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    next(error);
  }
};
