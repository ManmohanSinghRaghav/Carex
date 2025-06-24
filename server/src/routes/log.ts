import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateFoodLog } from '../middleware/validation';
import { validationResult } from 'express-validator';
import FoodLog from '../models/FoodLog';
import Food from '../models/Food';

const router = express.Router();

// GET /api/logs/daily
router.get('/daily', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { date } = req.query;
    
    const queryDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const logs = await FoodLog.find({
      userId: user._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .populate('foodId', 'name brand caloriesPerServing servingSize servingUnit category')
    .sort({ createdAt: -1 });
    
    // Calculate totals by meal type
    const summary = {
      totalCalories: 0,
      breakdown: {
        breakfast: { calories: 0, items: 0 },
        lunch: { calories: 0, items: 0 },
        dinner: { calories: 0, items: 0 },
        snack: { calories: 0, items: 0 }
      }
    };
    
    logs.forEach(log => {
      summary.totalCalories += log.totalCalories;
      summary.breakdown[log.mealType].calories += log.totalCalories;
      summary.breakdown[log.mealType].items += 1;
    });
    
    res.json({
      logs,
      summary,
      date: queryDate,
      remainingCalories: (user.profile.dailyCalorieGoal || 2000) - summary.totalCalories
    });
  } catch (error) {
    console.error('Get daily logs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/logs
router.post('/', authenticateToken, validateFoodLog, async (req: AuthRequest, res: Response) => {
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
    const { foodId, date, mealType, quantity, unit, totalCalories, notes } = req.body;
    
    // Verify food exists
    const food = await Food.findById(foodId);
    if (!food) {
      res.status(404).json({ message: 'Food not found' });
      return;
    }
    
    const log = new FoodLog({
      userId: user._id,
      foodId,
      date: new Date(date),
      mealType,
      quantity,
      unit,
      totalCalories,
      notes
    });
    
    await log.save();
    await log.populate('foodId', 'name brand caloriesPerServing servingSize servingUnit category');
    
    res.status(201).json({
      message: 'Food logged successfully',
      log
    });
  } catch (error) {
    console.error('Create food log error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/logs/:id
router.put('/:id', authenticateToken, validateFoodLog, async (req: AuthRequest, res: Response) => {
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
    const logId = req.params.id;
    
    const log = await FoodLog.findOne({
      _id: logId,
      userId: user._id
    });
    
    if (!log) {
      res.status(404).json({ message: 'Food log not found' });
      return;
    }
    
    // Update log fields
    const { quantity, unit, totalCalories, notes, mealType } = req.body;
    
    log.quantity = quantity;
    log.unit = unit;
    log.totalCalories = totalCalories;
    log.notes = notes;
    log.mealType = mealType;
    
    await log.save();
    await log.populate('foodId', 'name brand caloriesPerServing servingSize servingUnit category');
    
    res.json({
      message: 'Food log updated successfully',
      log
    });
  } catch (error) {
    console.error('Update food log error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/logs/:id
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const logId = req.params.id;
    
    const log = await FoodLog.findOneAndDelete({
      _id: logId,
      userId: user._id
    });
    
    if (!log) {
      res.status(404).json({ message: 'Food log not found' });
      return;
    }
    
    res.json({ message: 'Food log deleted successfully' });
  } catch (error) {
    console.error('Delete food log error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/logs/stats
router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { period = 'week' } = req.query;
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    const logs = await FoodLog.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalCalories: { $sum: '$totalCalories' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json({
      period,
      stats: logs,
      averageCalories: logs.length > 0 ? logs.reduce((sum, day) => sum + day.totalCalories, 0) / logs.length : 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
