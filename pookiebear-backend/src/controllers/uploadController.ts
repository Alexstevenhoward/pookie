import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'pookiebear-photos';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];

export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type. Only JPEG, PNG, and HEIC images are allowed'
      });
    }

    // Validate file size
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        error: 'File too large. Maximum size is 5MB'
      });
    }

    // Process image with sharp (resize, optimize)
    const processedImage = await sharp(req.file.buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const fileExtension = 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `photos/${fileName}`;

    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: processedImage,
      ContentType: 'image/jpeg',
      ACL: 'public-read' as const,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Construct URL
    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

    res.json({
      url,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload photo',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
