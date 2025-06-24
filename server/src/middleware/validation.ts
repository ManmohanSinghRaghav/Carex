import { body, ValidationChain } from 'express-validator';

export const validateRegistration: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateProfile: ValidationChain[] = [
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg'),
  
  body('height')
    .optional()
    .isInt({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  
  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'])
    .withMessage('Invalid activity level'),
  
  body('goal')
    .optional()
    .isIn(['lose_weight', 'maintain_weight', 'gain_weight'])
    .withMessage('Invalid goal'),
  
  body('dailyCalorieGoal')
    .optional()
    .isInt({ min: 800, max: 5000 })
    .withMessage('Daily calorie goal must be between 800 and 5000')
];

export const validateFoodLog: ValidationChain[] = [
  body('foodId')
    .isMongoId()
    .withMessage('Invalid food ID'),
  
  body('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  
  body('quantity')
    .isFloat({ min: 0.1 })
    .withMessage('Quantity must be at least 0.1'),
  
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required'),
  
  body('totalCalories')
    .isFloat({ min: 0 })
    .withMessage('Total calories must be a positive number'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

export const validateFood: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .withMessage('Food name must be between 2 and 100 characters'),
  
  body('caloriesPerServing')
    .isFloat({ min: 0 })
    .withMessage('Calories per serving must be a positive number'),
  
  body('servingSize')
    .trim()
    .notEmpty()
    .withMessage('Serving size is required'),
  
  body('servingUnit')
    .trim()
    .notEmpty()
    .withMessage('Serving unit is required'),
  
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Brand name must be less than 50 characters'),
  
  body('category')
    .optional()
    .isIn(['fruits', 'vegetables', 'grains', 'protein', 'dairy', 'fats_oils', 'beverages', 'snacks', 'desserts', 'fast_food', 'other'])
    .withMessage('Invalid category')
];
