import { Router } from 'express';
import {
  register,
  login,
  sendSMSCode,
  verifySMSCode,
  refreshToken,
  logout,
  registerValidation,
  loginValidation,
} from '../controllers/authController';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/send-code', sendSMSCode);
router.post('/verify-code', verifySMSCode);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;