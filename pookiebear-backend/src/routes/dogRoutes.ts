import { Router } from 'express';
import {
  getUserDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog,
  addDogPhoto,
  dogValidation,
} from '../controllers/dogController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getUserDogs);
router.get('/:id', getDogById);
router.post('/', dogValidation, createDog);
router.patch('/:id', updateDog);
router.delete('/:id', deleteDog);
router.post('/:id/photos', addDogPhoto);

export default router;