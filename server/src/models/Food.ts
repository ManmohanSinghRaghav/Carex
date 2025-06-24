import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  name: string;
  brand?: string;
  caloriesPerServing: number;
  servingSize: string;
  servingUnit: string;
  nutrients?: {
    protein?: number; // in grams
    carbohydrates?: number; // in grams
    fat?: number; // in grams
    fiber?: number; // in grams
    sugar?: number; // in grams
    sodium?: number; // in mg
  };
  barcode?: string;
  category?: string;
  isVerified: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  brand: {
    type: String,
    trim: true
  },
  caloriesPerServing: {
    type: Number,
    required: true,
    min: 0
  },
  servingSize: {
    type: String,
    required: true,
    trim: true
  },
  servingUnit: {
    type: String,
    required: true,
    trim: true
  },
  nutrients: {
    protein: {
      type: Number,
      min: 0
    },
    carbohydrates: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    },
    fiber: {
      type: Number,
      min: 0
    },
    sugar: {
      type: Number,
      min: 0
    },
    sodium: {
      type: Number,
      min: 0
    }
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    enum: [
      'fruits',
      'vegetables',
      'grains',
      'protein',
      'dairy',
      'fats_oils',
      'beverages',
      'snacks',
      'desserts',
      'fast_food',
      'other'
    ],
    default: 'other'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create compound index for searching
FoodSchema.index({ name: 'text', brand: 'text' });

export default mongoose.model<IFood>('Food', FoodSchema);
