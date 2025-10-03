import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { body, validationResult } from 'express-validator';

const userRepository = AppDataSource.getRepository(User);

// Validation rules
export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// SMS Code storage (in production, use Redis)
const smsCodeStore = new Map<string, { code: string; expiresAt: number }>();

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phoneNumber } = req.body;

    // Check if user exists
    const existingUser = await userRepository.findOne({
      where: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phoneNumber,
    });

    await userRepository.save(user);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        subscriptionTier: user.subscriptionTier,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await userRepository.findOne({ where: { email } });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await userRepository.save(user);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePhotoUrl: user.profilePhotoUrl,
        subscriptionTier: user.subscriptionTier,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendSMSCode = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code (in production, use Redis)
    smsCodeStore.set(phoneNumber, { code, expiresAt });

    // TODO: Send SMS via Twilio
    console.log(`SMS Code for ${phoneNumber}: ${code}`);

    res.json({ message: 'SMS code sent successfully' });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ error: 'Failed to send SMS code' });
  }
};

export const verifySMSCode = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, code, firstName, lastName } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({ error: 'Phone number and code required' });
    }

    // Verify code
    const storedData = smsCodeStore.get(phoneNumber);

    if (!storedData) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    if (Date.now() > storedData.expiresAt) {
      smsCodeStore.delete(phoneNumber);
      return res.status(400).json({ error: 'Code expired' });
    }

    // Delete used code
    smsCodeStore.delete(phoneNumber);

    // Find or create user
    let user = await userRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      user = userRepository.create({
        phoneNumber,
        firstName: firstName || 'User',
        lastName: lastName || '',
      });
      await userRepository.save(user);
    }

    // Update last login
    user.lastLogin = new Date();
    await userRepository.save(user);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || '',
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email || '',
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        subscriptionTier: user.subscriptionTier,
      },
    });
  } catch (error) {
    console.error('Verify SMS error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // In a production app, you'd invalidate the refresh token here
  res.json({ message: 'Logged out successfully' });
};