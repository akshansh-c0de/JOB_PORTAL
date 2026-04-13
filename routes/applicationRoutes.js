import express from 'express';
import { applyToJob, getMyApplications } from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * All application routes are protected (require login)
 */
router.use(protect);

// Candidates apply for jobs
router.post('/apply/:jobId', authorizeRoles('candidate'), applyToJob);

// Users (Candidates) view their own applications
router.get('/me', getMyApplications);

export default router;
