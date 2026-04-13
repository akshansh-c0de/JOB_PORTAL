import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';
import ErrorHandler from '../utils/errorHandler.js';

// Apply for a job
export const applyToJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const { resume } = req.body;

    // Check if the job actually exists before applying
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return next(new ErrorHandler('This job has been removed or does not exist', 404));
    }

    // Checking if user already applied
    // Initially I thought of checking this in the frontend, but backend check is safer
    const alreadyApplied = await Application.findOne({ jobId, userId });

    if (alreadyApplied) {
      return next(new ErrorHandler('Hold on! You have already applied for this position.', 400));
    }

    const application = await Application.create({
      jobId,
      userId,
      resume
    });

    res.status(201).json({
      success: true,
      message: 'Application sent! Good luck.',
      application
    });
  } catch (error) {
    // If user tries to apply twice, Mongo throws a duplicate key error (11000)
    // Handled by our global error middleware
    next(error);
  }
};

// Get jobs applied by current user
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId', 'title company location')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// API for recruiters to see who applied to their jobs
export const getJobApplications = async (req, res, next) => {
  try {
    // TODO: Verify if the recruiter requesting this is the one who posted the job
    // For now, any recruiter can see, but I should restrict this in next update
    
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    next(error);
  }
};
