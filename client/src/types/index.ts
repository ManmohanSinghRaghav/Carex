export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: {
    age?: number;
    gender?: 'male' | 'female' | 'other';
    weight?: number;
    height?: number;
    activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
    goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
    dailyCalorieGoal?: number;
  };
  createdAt: string;
}

export interface Food {
  _id: string;
  name: string;
  brand?: string;
  caloriesPerServing: number;
  servingSize: string;
  servingUnit: string;
  nutrients?: {
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  category?: string;
  isVerified: boolean;
  createdBy?: string;
}

export interface FoodLog {
  _id: string;
  userId: string;
  foodId: Food;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  unit: string;
  totalCalories: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailySummary {
  totalCalories: number;
  breakdown: {
    breakfast: { calories: number; items: number };
    lunch: { calories: number; items: number };
    dinner: { calories: number; items: number };
    snack: { calories: number; items: number };
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}
