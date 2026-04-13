import mongoose from 'mongoose';

/**
 * Application Schema
 * This tracks which user has applied to which job
 */
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job', // Which job are they applying for?
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Who is applying?
    required: true,
  },
  resume: {
    type: String,
    required: [true, 'Please provide a link to your resume or paste it here'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending', // By default, application is pending
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * This is important: We create a unique index for (jobId + userId)
 * This prevents the same user from applying to the same job twice!
 */
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
