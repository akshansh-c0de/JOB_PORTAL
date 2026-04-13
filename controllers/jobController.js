import Job from '../models/jobModel.js';
import ErrorHandler from '../utils/errorHandler.js';

// Get all jobs with optional searching and pagination
export const getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, page = 1, limit = 10 } = req.query;

    // Search query object
    let queryObj = {};

    // If user provides a keyword, we search for it in the Job Title (case-insensitive)
    if (keyword) {
      queryObj.title = { $regex: keyword, $options: 'i' };
    }

    // If user provides a location filter
    if (location) {
      queryObj.location = { $regex: location, $options: 'i' };
    }

    // Pagination logic
    const skipAmount = (page - 1) * limit;

    const allJobs = await Job.find(queryObj)
      .limit(limit)
      .skip(skipAmount)
      .sort({ createdAt: -1 }) // Show latest jobs first
      .populate('createdBy', 'name email'); // Show name of the recruiter who posted it

    // Count total jobs found (for frontend pagination UI)
    const totalJobs = await Job.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: allJobs.length,
      total: totalJobs,
      data: allJobs
    });
  } catch (err) {
    next(err);
  }
};

// Create a new Job (Only for recruiters)
export const createJob = async (req, res, next) => {
  try {
    // We get the recruiter's ID from req.user (which was added by our auth middleware)
    req.body.createdBy = req.user.id;

    const newJob = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: 'New job posted successfully!',
      data: newJob
    });
  } catch (err) {
    next(err);
  }
};

// Get details of a single job
export const getJobById = async (req, res, next) => {
  try {
    const jobDetail = await Job.findById(req.params.id).populate('createdBy', 'name email');

    if (!jobDetail) {
      return next(new ErrorHandler('Sorry, this job was not found', 404));
    }

    res.status(200).json({
      success: true,
      data: jobDetail
    });
  } catch (err) {
    next(err);
  }
};
