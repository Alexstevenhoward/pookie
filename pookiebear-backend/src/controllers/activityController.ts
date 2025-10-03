import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Activity } from '../entities/Activity';
import { Dog } from '../entities/Dog';
import { AuthRequest } from '../middleware/auth';
import { Between } from 'typeorm';

const activityRepository = AppDataSource.getRepository(Activity);
const dogRepository = AppDataSource.getRepository(Dog);

// Get all activities for a dog
export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;
    const { startDate, endDate, type } = req.query;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const whereClause: any = { dogId };

    if (startDate && endDate) {
      whereClause.startTime = Between(
        new Date(startDate as string),
        new Date(endDate as string)
      );
    }

    if (type) {
      whereClause.activityType = type;
    }

    const activities = await activityRepository.find({
      where: whereClause,
      order: { startTime: 'DESC' },
    });

    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

// Create walk activity with GPS tracking
export const createWalk = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;
    const walkData = req.body;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    // Calculate distance in miles from meters
    const distanceMiles = walkData.distanceMeters
      ? walkData.distanceMeters / 1609.34
      : 0;

    const activity = activityRepository.create({
      ...walkData,
      dogId,
      userId,
      activityType: 'walk',
    });

    await activityRepository.save(activity);

    res.status(201).json({
      activity: {
        ...activity,
        distanceMiles,
      },
    });
  } catch (error) {
    console.error('Create walk error:', error);
    res.status(500).json({ error: 'Failed to create walk' });
  }
};

// Create manual activity
export const createActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;
    const activityData = req.body;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const activity = activityRepository.create({
      ...activityData,
      dogId,
      userId,
    });

    await activityRepository.save(activity);

    res.status(201).json({ activity });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
};

// Get activity statistics
export const getActivityStats = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;
    const { period } = req.query; // 'day', 'week', 'month'

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const activities = await activityRepository.find({
      where: {
        dogId,
        startTime: Between(startDate, now),
      },
    });

    // Calculate statistics
    const totalActivities = activities.length;
    const totalDistance = activities.reduce(
      (sum, act) => sum + (act.distanceMeters || 0),
      0
    );
    const totalDuration = activities.reduce(
      (sum, act) => sum + (act.durationSeconds || 0),
      0
    );
    const totalCalories = activities.reduce(
      (sum, act) => sum + (act.caloriesBurned || 0),
      0
    );

    const walks = activities.filter((act) => act.activityType === 'walk');
    const averageWalkDistance =
      walks.length > 0
        ? walks.reduce((sum, walk) => sum + (walk.distanceMeters || 0), 0) /
          walks.length
        : 0;

    res.json({
      period,
      stats: {
        totalActivities,
        totalDistanceMeters: totalDistance,
        totalDistanceMiles: totalDistance / 1609.34,
        totalDurationMinutes: Math.round(totalDuration / 60),
        totalCalories,
        walkCount: walks.length,
        averageWalkDistanceMeters: averageWalkDistance,
        averageWalkDistanceMiles: averageWalkDistance / 1609.34,
      },
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ error: 'Failed to fetch activity stats' });
  }
};

// Update activity
export const updateActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId, activityId } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const activity = await activityRepository.findOne({
      where: { id: activityId, dogId },
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    Object.assign(activity, updateData);
    await activityRepository.save(activity);

    res.json({ activity });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
};

// Delete activity
export const deleteActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId, activityId } = req.params;
    const userId = req.userId;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const result = await activityRepository.delete({
      id: activityId,
      dogId,
    });

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};