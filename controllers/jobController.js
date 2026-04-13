import Job from '../models/jobModel.js';
import ErrorHandler from '../utils/errorHandler.js';

/**
 * Get all the jobs from the database
 * Supports searching by keyword and location
 */
export const getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, page, limit } = req.query;

    // This object will hold our search filters
    const filterOptions = {};

    // Searching for keywords in job titles (case-insensitive)
    if (keyword) {
      filterOptions.title = { $regex: keyword, $options: 'i' };
    }

    // Filtering by location name
    if (location) {
      filterOptions.location = { $regex: location, $options: 'i' };
    }

    // Pagination setup
    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 10;
    const skipItems = (currentPage - 1) * itemsPerPage;

    // Fetching the jobs with sorting and pagination
    const allJobs = await Job.find(filterOptions)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }) // -1 means descending (latest first)
      .skip(skipItems)
      .limit(itemsPerPage);

    // Counting total jobs to calculate total pages
    const totalJobsCount = await Job.countDocuments(filterOptions);

    res.status(200).json({
      success: true,
      data: allJobs,
      pagination: {
        totalJobs: totalJobsCount,
        totalPages: Math.ceil(totalJobsCount / itemsPerPage),
        currentPage: currentPage
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get single job by its ID
 */
export const getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const jobData = await Job.findById(jobId).populate('createdBy', 'name email');

    if (!jobData) {
      return next(new ErrorHandler('Sorry, this job could not be found.', 404));
    }

    res.status(200).json({
      success: true,
      job: jobData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new job post (Recruiter only)
 */
export const createJob = async (req, res, next) => {
  try {
    // We attach the ID of the person creating the job (the logged-in recruiter)
    const jobData = req.body;
    jobData.createdBy = req.user.id;

    const newJobCreated = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job: newJobCreated,
    });
  } catch (error) {
    next(error);
  }
};
