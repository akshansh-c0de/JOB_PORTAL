import mongoose from 'mongoose';

/**
 * Job Schema
 * This defines how a job post is structured in our database
 */
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide the job title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide the company name'],
  },
  location: {
    type: String,
    required: [true, 'Please provide the job location (e.g. Remote, Delhi)'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a short description about the job'],
  },
  salary: {
    type: Number,
    required: [true, 'Please enter the expected salary amount'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Linking this job to the recruiter who posted it
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Adding database indices to make searching faster
 */
jobSchema.index({ title: 'text' });
jobSchema.index({ location: 1 });

export default mongoose.model('Job', jobSchema);
