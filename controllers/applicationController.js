import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';
import ErrorHandler from '../utils/errorHandler.js';

/**
 * Handle Job Applications
 * This allows a candidate to apply for a job using its ID
 */
export const applyToJob = async (req, res, next) => {
  try {
    const jobIdFromPara = req.params.jobId;
    const userIdFromToken = req.user.id; // User ID extracted by protect middleware
    const { resume } = req.body;

    // Step 1: Check if the job actually exists before applying
    const foundJob = await Job.findById(jobIdFromPara);
    if (!foundJob) {
      return next(new ErrorHandler('Job not found. It might have been deleted.', 404));
    }

    // Step 2: Stop the user if they already applied to this same job
    const alreadyApplied = await Application.findOne({ 
        jobId: jobIdFromPara, 
        userId: userIdFromToken 
    });
    
    if (alreadyApplied) {
      return next(new ErrorHandler('You have already applied for this job once.', 400));
    }

    // Step 3: Create the application record
    const newApplication = await Application.create({
      jobId: jobIdFromPara,
      userId: userIdFromToken,
      resume: resume,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted! Good luck!',
      data: newApplication,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * View My Applications
 * Shows all the jobs the current user has applied to
 */
export const getMyApplications = async (req, res, next) => {
  try {
    // We search for applications where userId matches the logged-in user
    // We also use .populate to get real job titles instead of just IDs
    const myApps = await Application.find({ userId: req.user.id })
      .populate('jobId', 'title company location')
      .sort({ appliedAt: -1 }); // Show latest applications first

    res.status(200).json({
      success: true,
      count: myApps.length,
      applications: myApps,
    });

  } catch (error) {
    next(error);
  }
};
