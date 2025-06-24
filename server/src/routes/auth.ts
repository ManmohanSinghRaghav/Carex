import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validation';

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRegistration, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/profile
router.get('/profile', authenticateToken, getProfile);

export default router;
