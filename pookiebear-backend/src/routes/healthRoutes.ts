import { Router } from 'express';
import {
  getVetVisits,
  createVetVisit,
  updateVetVisit,
  getVaccinations,
  createVaccination,
  getMedications,
  createMedication,
  getAllergies,
  createAllergy,
} from '../controllers/healthController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Vet visits
router.get('/:dogId/visits', getVetVisits);
router.post('/:dogId/visits', createVetVisit);
router.patch('/:dogId/visits/:visitId', updateVetVisit);

// Vaccinations
router.get('/:dogId/vaccinations', getVaccinations);
router.post('/:dogId/vaccinations', createVaccination);

// Medications
router.get('/:dogId/medications', getMedications);
router.post('/:dogId/medications', createMedication);

// Allergies
router.get('/:dogId/allergies', getAllergies);
router.post('/:dogId/allergies', createAllergy);

export default router;