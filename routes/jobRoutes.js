import express from 'express';
import { getAllJobs, createJob, getJobById } from '../controllers/jobController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Route defines for Job operations.
 * - GET: Public access to see all jobs.
 * - POST: Restricted to logged-in users with 'recruiter' role.
 */
router.route('/jobs')
  .get(getAllJobs)
  .post(protect, authorizeRoles('recruiter'), createJob);

/**
 * - GET: Public access to see specific job details.
 */
router.route('/jobs/:id')
  .get(getJobById);

export default router;
