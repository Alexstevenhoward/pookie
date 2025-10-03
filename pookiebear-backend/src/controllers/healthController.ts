import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { VetVisit } from '../entities/VetVisit';
import { Vaccination } from '../entities/Vaccination';
import { Medication } from '../entities/Medication';
import { Allergy } from '../entities/Allergy';
import { Dog } from '../entities/Dog';
import { AuthRequest } from '../middleware/auth';

const vetVisitRepository = AppDataSource.getRepository(VetVisit);
const vaccinationRepository = AppDataSource.getRepository(Vaccination);
const medicationRepository = AppDataSource.getRepository(Medication);
const allergyRepository = AppDataSource.getRepository(Allergy);
const dogRepository = AppDataSource.getRepository(Dog);

// Vet Visits
export const getVetVisits = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;

    // Verify dog ownership
    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const visits = await vetVisitRepository.find({
      where: { dogId },
      order: { visitDate: 'DESC' },
    });

    res.json({ visits });
  } catch (error) {
    console.error('Get vet visits error:', error);
    res.status(500).json({ error: 'Failed to fetch vet visits' });
  }
};

export const createVetVisit = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;
    const visitData = req.body;

    // Verify dog ownership
    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const visit = vetVisitRepository.create({
      ...visitData,
      dogId,
    });

    await vetVisitRepository.save(visit);

    res.status(201).json({ visit });
  } catch (error) {
    console.error('Create vet visit error:', error);
    res.status(500).json({ error: 'Failed to create vet visit' });
  }
};

export const updateVetVisit = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId, visitId } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    // Verify dog ownership
    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const visit = await vetVisitRepository.findOne({
      where: { id: visitId, dogId },
    });

    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    Object.assign(visit, updateData);
    await vetVisitRepository.save(visit);

    res.json({ visit });
  } catch (error) {
    console.error('Update vet visit error:', error);
    res.status(500).json({ error: 'Failed to update vet visit' });
  }
};

// Vaccinations
export const getVaccinations = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const vaccinations = await vaccinationRepository.find({
      where: { dogId },
      order: { administrationDate: 'DESC' },
    });

    res.json({ vaccinations });
  } catch (error) {
    console.error('Get vaccinations error:', error);
    res.status(500).json({ error: 'Failed to fetch vaccinations' });
  }
};

export const createVaccination = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;
    const vaccinationData = req.body;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const vaccination = vaccinationRepository.create({
      ...vaccinationData,
      dogId,
    });

    await vaccinationRepository.save(vaccination);

    res.status(201).json({ vaccination });
  } catch (error) {
    console.error('Create vaccination error:', error);
    res.status(500).json({ error: 'Failed to create vaccination' });
  }
};

// Medications
export const getMedications = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const medications = await medicationRepository.find({
      where: { dogId },
      order: { startDate: 'DESC' },
    });

    res.json({ medications });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
};

export const createMedication = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;
    const medicationData = req.body;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const medication = medicationRepository.create({
      ...medicationData,
      dogId,
    });

    await medicationRepository.save(medication);

    res.status(201).json({ medication });
  } catch (error) {
    console.error('Create medication error:', error);
    res.status(500).json({ error: 'Failed to create medication' });
  }
};

// Allergies
export const getAllergies = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const allergies = await allergyRepository.find({
      where: { dogId },
    });

    res.json({ allergies });
  } catch (error) {
    console.error('Get allergies error:', error);
    res.status(500).json({ error: 'Failed to fetch allergies' });
  }
};

export const createAllergy = async (req: AuthRequest, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = req.userId;
    const allergyData = req.body;

    const dog = await dogRepository.findOne({
      where: { id: dogId, ownerId: userId },
    });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const allergy = allergyRepository.create({
      ...allergyData,
      dogId,
    });

    await allergyRepository.save(allergy);

    res.status(201).json({ allergy });
  } catch (error) {
    console.error('Create allergy error:', error);
    res.status(500).json({ error: 'Failed to create allergy' });
  }
};