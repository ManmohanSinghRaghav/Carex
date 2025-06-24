import Food from '../models/Food';

export const seedFoods = async () => {
  try {
    // Check if foods already exist
    const existingFoods = await Food.countDocuments();
    if (existingFoods > 0) {
      console.log('✅ Foods already seeded');
      return;
    }

    const sampleFoods = [
      // Fruits
      {
        name: 'Apple',
        caloriesPerServing: 95,
        servingSize: '1',
        servingUnit: 'medium apple',
        category: 'fruits',
        isVerified: true,
        nutrients: {
          protein: 0.5,
          carbohydrates: 25,
          fat: 0.3,
          fiber: 4,
          sugar: 19
        }
      },
      {
        name: 'Banana',
        caloriesPerServing: 105,
        servingSize: '1',
        servingUnit: 'medium banana',
        category: 'fruits',
        isVerified: true,
        nutrients: {
          protein: 1.3,
          carbohydrates: 27,
          fat: 0.4,
          fiber: 3,
          sugar: 14
        }
      },
      {
        name: 'Orange',
        caloriesPerServing: 62,
        servingSize: '1',
        servingUnit: 'medium orange',
        category: 'fruits',
        isVerified: true,
        nutrients: {
          protein: 1.2,
          carbohydrates: 15,
          fat: 0.2,
          fiber: 3,
          sugar: 12
        }
      },

      // Vegetables
      {
        name: 'Broccoli',
        caloriesPerServing: 25,
        servingSize: '1',
        servingUnit: 'cup chopped',
        category: 'vegetables',
        isVerified: true,
        nutrients: {
          protein: 3,
          carbohydrates: 5,
          fat: 0.3,
          fiber: 2,
          sugar: 1
        }
      },
      {
        name: 'Spinach',
        caloriesPerServing: 7,
        servingSize: '1',
        servingUnit: 'cup raw',
        category: 'vegetables',
        isVerified: true,
        nutrients: {
          protein: 0.9,
          carbohydrates: 1,
          fat: 0.1,
          fiber: 0.7,
          sugar: 0.1
        }
      },

      // Grains
      {
        name: 'Brown Rice',
        caloriesPerServing: 216,
        servingSize: '1',
        servingUnit: 'cup cooked',
        category: 'grains',
        isVerified: true,
        nutrients: {
          protein: 5,
          carbohydrates: 45,
          fat: 1.8,
          fiber: 4,
          sugar: 0.7
        }
      },
      {
        name: 'Quinoa',
        caloriesPerServing: 222,
        servingSize: '1',
        servingUnit: 'cup cooked',
        category: 'grains',
        isVerified: true,
        nutrients: {
          protein: 8,
          carbohydrates: 39,
          fat: 3.6,
          fiber: 5,
          sugar: 1.6
        }
      },

      // Protein
      {
        name: 'Chicken Breast',
        caloriesPerServing: 231,
        servingSize: '100',
        servingUnit: 'grams',
        category: 'protein',
        isVerified: true,
        nutrients: {
          protein: 31,
          carbohydrates: 0,
          fat: 3.6,
          fiber: 0,
          sugar: 0
        }
      },
      {
        name: 'Salmon',
        caloriesPerServing: 208,
        servingSize: '100',
        servingUnit: 'grams',
        category: 'protein',
        isVerified: true,
        nutrients: {
          protein: 25,
          carbohydrates: 0,
          fat: 12,
          fiber: 0,
          sugar: 0
        }
      },
      {
        name: 'Eggs',
        caloriesPerServing: 155,
        servingSize: '2',
        servingUnit: 'large eggs',
        category: 'protein',
        isVerified: true,
        nutrients: {
          protein: 13,
          carbohydrates: 1.1,
          fat: 11,
          fiber: 0,
          sugar: 0.6
        }
      },

      // Dairy
      {
        name: 'Greek Yogurt',
        caloriesPerServing: 100,
        servingSize: '1',
        servingUnit: 'cup plain',
        category: 'dairy',
        isVerified: true,
        nutrients: {
          protein: 17,
          carbohydrates: 6,
          fat: 0.7,
          fiber: 0,
          sugar: 6
        }
      },
      {
        name: 'Milk',
        caloriesPerServing: 103,
        servingSize: '1',
        servingUnit: 'cup 1% fat',
        category: 'dairy',
        isVerified: true,
        nutrients: {
          protein: 8,
          carbohydrates: 13,
          fat: 2.4,
          fiber: 0,
          sugar: 13
        }
      },

      // Snacks
      {
        name: 'Almonds',
        caloriesPerServing: 164,
        servingSize: '1',
        servingUnit: 'ounce (28g)',
        category: 'snacks',
        isVerified: true,
        nutrients: {
          protein: 6,
          carbohydrates: 6,
          fat: 14,
          fiber: 4,
          sugar: 1
        }
      },
      {
        name: 'Peanut Butter',
        caloriesPerServing: 188,
        servingSize: '2',
        servingUnit: 'tablespoons',
        category: 'snacks',
        isVerified: true,
        nutrients: {
          protein: 8,
          carbohydrates: 8,
          fat: 16,
          fiber: 3,
          sugar: 3
        }
      },

      // Beverages
      {
        name: 'Green Tea',
        caloriesPerServing: 2,
        servingSize: '1',
        servingUnit: 'cup',
        category: 'beverages',
        isVerified: true,
        nutrients: {
          protein: 0.5,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0
        }
      },
      {
        name: 'Orange Juice',
        caloriesPerServing: 112,
        servingSize: '1',
        servingUnit: 'cup',
        category: 'beverages',
        isVerified: true,
        nutrients: {
          protein: 2,
          carbohydrates: 26,
          fat: 0.5,
          fiber: 0.5,
          sugar: 21
        }
      }
    ];

    await Food.insertMany(sampleFoods);
    console.log('✅ Sample foods seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding foods:', error);
  }
};
