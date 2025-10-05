import express from 'express';
import multer from 'multer';
import { uploadPhoto } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * @route POST /api/v1/upload/photo
 * @desc Upload a photo to S3
 * @access Private
 */
router.post('/photo', authenticate, upload.single('photo'), uploadPhoto);

export default router;
