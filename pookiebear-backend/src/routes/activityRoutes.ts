import { Router } from 'express';
import {
  getActivities,
  createWalk,
  createActivity,
  getActivityStats,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/:dogId', getActivities);
router.post('/:dogId/walks', createWalk);
router.post('/:dogId', createActivity);
router.get('/:dogId/stats', getActivityStats);
router.patch('/:dogId/:activityId', updateActivity);
router.delete('/:dogId/:activityId', deleteActivity);

export default router;