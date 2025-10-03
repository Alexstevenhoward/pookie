import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Dog } from '../entities/Dog';
import { AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const dogRepository = AppDataSource.getRepository(Dog);

export const dogValidation = [
  body('name').trim().notEmpty(),
  body('breed').trim().notEmpty(),
  body('dateOfBirth').isISO8601(),
  body('gender').isIn(['male', 'female']),
  body('weightLbs').isFloat({ min: 0 }),
];

// Get all dogs for authenticated user
export const getUserDogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const dogs = await dogRepository.find({
      where: { ownerId: userId, archived: false },
      order: { createdAt: 'DESC' },
    });

    res.json({ dogs });
  } catch (error) {
    console.error('Get dogs error:', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
};

// Get single dog by ID
export const getDogById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const dog = await dogRepository.findOne({
      where: { id, ownerId: userId },
      relations: [
        'vaccinations',
        'vetVisits',
        'medications',
        'allergies',
        'activities',
      ],
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    res.json({ dog });
  } catch (error) {
    console.error('Get dog error:', error);
    res.status(500).json({ error: 'Failed to fetch dog' });
  }
};

// Create new dog
export const createDog = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;
    const dogData = req.body;

    const dog = dogRepository.create({
      ...dogData,
      ownerId: userId,
    });

    await dogRepository.save(dog);

    res.status(201).json({ dog });
  } catch (error) {
    console.error('Create dog error:', error);
    res.status(500).json({ error: 'Failed to create dog' });
  }
};

// Update dog
export const updateDog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    const dog = await dogRepository.findOne({
      where: { id, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    // Update fields
    Object.assign(dog, updateData);
    await dogRepository.save(dog);

    res.json({ dog });
  } catch (error) {
    console.error('Update dog error:', error);
    res.status(500).json({ error: 'Failed to update dog' });
  }
};

// Delete dog (soft delete - archive)
export const deleteDog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const dog = await dogRepository.findOne({
      where: { id, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    dog.archived = true;
    dog.archivedDate = new Date();
    await dogRepository.save(dog);

    res.json({ message: 'Dog archived successfully' });
  } catch (error) {
    console.error('Delete dog error:', error);
    res.status(500).json({ error: 'Failed to delete dog' });
  }
};

// Add photo to dog
export const addDogPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { photoUrl } = req.body;

    const dog = await dogRepository.findOne({
      where: { id, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    if (!dog.profilePhotoUrl) {
      dog.profilePhotoUrl = photoUrl;
    } else {
      const photos = dog.additionalPhotos || [];
      if (photos.length >= 10) {
        return res.status(400).json({ error: 'Maximum 10 photos allowed' });
      }
      dog.additionalPhotos = [...photos, photoUrl];
    }

    await dogRepository.save(dog);

    res.json({ dog });
  } catch (error) {
    console.error('Add photo error:', error);
    res.status(500).json({ error: 'Failed to add photo' });
  }
};