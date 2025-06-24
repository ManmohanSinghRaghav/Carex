import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateFood } from '../middleware/validation';
import { validationResult } from 'express-validator';
import Food from '../models/Food';

const router = express.Router();

// GET /api/foods/search
router.get('/search', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { q, category, limit = 20, page = 1 } = req.query;
    
    const query: any = {};
    
    if (q) {
      query.$text = { $search: q as string };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const foods = await Food.find(query)
      .select('-__v')
      .limit(parseInt(limit as string))
      .skip(skip)
      .sort({ isVerified: -1, name: 1 });
    
    const total = await Food.countDocuments(query);
    
    res.json({
      foods,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/foods/meta/categories
router.get('/meta/categories', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const categories = [
      { value: 'fruits', label: 'Fruits' },
      { value: 'vegetables', label: 'Vegetables' },
      { value: 'grains', label: 'Grains' },
      { value: 'protein', label: 'Protein' },
      { value: 'dairy', label: 'Dairy' },
      { value: 'fats_oils', label: 'Fats & Oils' },
      { value: 'beverages', label: 'Beverages' },
      { value: 'snacks', label: 'Snacks' },
      { value: 'desserts', label: 'Desserts' },
      { value: 'fast_food', label: 'Fast Food' },
      { value: 'other', label: 'Other' }
    ];
    
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/foods/:id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      res.status(404).json({ message: 'Food not found' });
      return;
    }
    
    res.json({ food });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/foods
router.post('/', authenticateToken, validateFood, async (req: AuthRequest, res: Response) => {
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
    const foodData = {
      ...req.body,
      createdBy: user._id,
      isVerified: false
    };
    
    const food = new Food(foodData);
    await food.save();
    
    res.status(201).json({
      message: 'Food created successfully',
      food
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
