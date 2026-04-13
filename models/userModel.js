import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * User Schema
 * This defines how our user data (Candidates and Recruiters) is stored in MongoDB
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true, // No two users can have the same email
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a secure password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // This hides the password from API responses by default
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],
    default: 'candidate',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Encrypting the password before saving to the database
 * We use 'pre-save' hook to hash the password so it's not stored in plain text
 */
userSchema.pre('save', async function (next) {
  // If the password hasn't changed, don't hash it again
  if (!this.isModified('password')) return next();

  // Generating a secure hash
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Helper function to check if the password matches during login
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generating a JWT Token
 * This token is like a 'digital ID card' for the user
 */
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default mongoose.model('User', userSchema);
