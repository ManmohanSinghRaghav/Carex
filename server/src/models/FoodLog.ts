import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodLog extends Document {
  userId: mongoose.Types.ObjectId;
  foodId: mongoose.Types.ObjectId;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  unit: string;
  totalCalories: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FoodLogSchema = new Schema<IFoodLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  foodId: {
    type: Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  totalCalories: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
FoodLogSchema.index({ userId: 1, date: -1 });
FoodLogSchema.index({ userId: 1, mealType: 1, date: -1 });

export default mongoose.model<IFoodLog>('FoodLog', FoodLogSchema);
