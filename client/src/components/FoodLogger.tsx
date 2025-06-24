import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useFoodSearch } from '../hooks/useFoodSearch';
import { Food } from '../types';

interface FoodLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodLogged: (logData: {
    foodId: string;
    quantity: number;
    unit: string;
    totalCalories: number;
    notes?: string;
  }) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const FoodLogger: React.FC<FoodLoggerProps> = ({
  isOpen,
  onClose,
  onFoodLogged,
  mealType,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [showCreateFood, setShowCreateFood] = useState(false);
  const [newFoodData, setNewFoodData] = useState({
    name: '',
    caloriesPerServing: '',
    servingSize: '1',
    servingUnit: 'serving',
    brand: '',
    category: 'other',
  });

  const { foods, isLoading, searchFoods, createFood, clearResults } = useFoodSearch();

  useEffect(() => {
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        searchFoods(searchQuery);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      clearResults();
    }
  }, [searchQuery, searchFoods, clearResults]);

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
    setQuantity('1');
  };

  const calculateTotalCalories = () => {
    if (!selectedFood) return 0;
    return Math.round(selectedFood.caloriesPerServing * parseFloat(quantity || '0'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;

    const totalCalories = calculateTotalCalories();
    
    onFoodLogged({
      foodId: selectedFood._id,
      quantity: parseFloat(quantity),
      unit: selectedFood.servingUnit,
      totalCalories,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSelectedFood(null);
    setQuantity('1');
    setNotes('');
    setSearchQuery('');
  };

  const handleCreateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const food = await createFood({
        name: newFoodData.name,
        caloriesPerServing: parseInt(newFoodData.caloriesPerServing),
        servingSize: newFoodData.servingSize,
        servingUnit: newFoodData.servingUnit,
        brand: newFoodData.brand || undefined,
        category: newFoodData.category as any,
      });
      
      setSelectedFood(food);
      setShowCreateFood(false);
      setNewFoodData({
        name: '',
        caloriesPerServing: '',
        servingSize: '1',
        servingUnit: 'serving',
        brand: '',
        category: 'other',
      });
    } catch (error) {
      console.error('Failed to create food:', error);
    }
  };

  const getMealIcon = () => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getMealIcon()}</span>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!selectedFood ? (
              // Food Search View
              <div className="p-6 space-y-6">
                {/* Search Input */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Create Food Button */}
                <button
                  onClick={() => setShowCreateFood(true)}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Can't find your food? Create a new one</span>
                </button>

                {/* Search Results */}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                )}

                {foods.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Search Results</h3>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {foods.map((food) => (
                        <button
                          key={food._id}
                          onClick={() => handleFoodSelect(food)}
                          className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {food.name}
                                {food.brand && (
                                  <span className="text-gray-500 ml-2">({food.brand})</span>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {food.caloriesPerServing} calories per {food.servingSize} {food.servingUnit}
                              </p>
                            </div>
                            {food.isVerified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery && !isLoading && foods.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No foods found for "{searchQuery}"</p>
                    <p className="text-sm mt-1">Try a different search term or create a new food</p>
                  </div>
                )}
              </div>
            ) : (
              // Food Logging Form
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Selected Food Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">
                    {selectedFood.name}
                    {selectedFood.brand && (
                      <span className="text-gray-500 ml-2">({selectedFood.brand})</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedFood.caloriesPerServing} calories per {selectedFood.servingSize} {selectedFood.servingUnit}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedFood(null)}
                    className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                  >
                    Change food
                  </button>
                </div>

                {/* Quantity Input */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="mt-1 flex items-center space-x-3">
                    <input
                      type="number"
                      id="quantity"
                      min="0.1"
                      step="0.1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="block w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <span className="text-gray-600">{selectedFood.servingUnit}</span>
                  </div>
                </div>

                {/* Total Calories Display */}
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-primary-800 font-medium">Total Calories:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {calculateTotalCalories()}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this food..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedFood(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Create Food Modal */}
          {showCreateFood && (
            <div className="absolute inset-0 bg-white">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create New Food</h3>
                <button
                  onClick={() => setShowCreateFood(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateFood} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Food Name *</label>
                  <input
                    type="text"
                    required
                    value={newFoodData.name}
                    onChange={(e) => setNewFoodData({ ...newFoodData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Calories per Serving *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newFoodData.caloriesPerServing}
                      onChange={(e) => setNewFoodData({ ...newFoodData, caloriesPerServing: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <input
                      type="text"
                      value={newFoodData.brand}
                      onChange={(e) => setNewFoodData({ ...newFoodData, brand: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Serving Size *</label>
                    <input
                      type="text"
                      required
                      value={newFoodData.servingSize}
                      onChange={(e) => setNewFoodData({ ...newFoodData, servingSize: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Serving Unit *</label>
                    <input
                      type="text"
                      required
                      value={newFoodData.servingUnit}
                      onChange={(e) => setNewFoodData({ ...newFoodData, servingUnit: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newFoodData.category}
                    onChange={(e) => setNewFoodData({ ...newFoodData, category: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="grains">Grains</option>
                    <option value="protein">Protein</option>
                    <option value="dairy">Dairy</option>
                    <option value="fats_oils">Fats & Oils</option>
                    <option value="beverages">Beverages</option>
                    <option value="snacks">Snacks</option>
                    <option value="desserts">Desserts</option>
                    <option value="fast_food">Fast Food</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateFood(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Create Food
                  </button>
                </div>
              </form>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FoodLogger;
