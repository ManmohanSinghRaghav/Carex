import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateProfile } from '../middleware/validation';
import { validationResult } from 'express-validator';
import User from '../models/User';

const router = express.Router();

// GET /api/users/profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticateToken, validateProfile, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const user = req.user!;
    const { age, gender, weight, height, activityLevel, goal, dailyCalorieGoal } = req.body;

    // Update profile fields
    if (age !== undefined) user.profile.age = age;
    if (gender !== undefined) user.profile.gender = gender;
    if (weight !== undefined) user.profile.weight = weight;
    if (height !== undefined) user.profile.height = height;
    if (activityLevel !== undefined) user.profile.activityLevel = activityLevel;
    if (goal !== undefined) user.profile.goal = goal;
    if (dailyCalorieGoal !== undefined) user.profile.dailyCalorieGoal = dailyCalorieGoal;

    // Calculate daily calorie goal if not provided but other data is available
    if (dailyCalorieGoal === undefined && user.profile.age && user.profile.weight && user.profile.height && user.profile.gender) {
      user.profile.dailyCalorieGoal = calculateDailyCalories(user.profile);
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to calculate daily calorie needs using Mifflin-St Jeor Equation
function calculateDailyCalories(profile: any): number {
  const { age, weight, height, gender, activityLevel, goal } = profile;
  
  // Base metabolic rate calculation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };
  
  let dailyCalories = bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55);
  
  // Adjust based on goal
  if (goal === 'lose_weight') {
    dailyCalories -= 500; // 500 calorie deficit for ~1 lb/week weight loss
  } else if (goal === 'gain_weight') {
    dailyCalories += 500; // 500 calorie surplus for weight gain
  }
  
  return Math.round(dailyCalories);
}

export default router;
