import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useFoodLogs } from '../hooks/useFoodLogs';
import CalorieProgress from '../components/CalorieProgress';
import FoodLogger from '../components/FoodLogger';
import DailyFoodList from '../components/DailyFoodList';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFoodLogger, setShowFoodLogger] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const { logs, summary, remainingCalories, isLoading, addFoodLog, deleteFoodLog } = useFoodLogs(selectedDate);

  const handlePreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handleAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMealType(mealType);
    setShowFoodLogger(true);
  };

  const handleFoodLogged = async (logData: any) => {
    try {
      await addFoodLog({
        ...logData,
        date: format(selectedDate, 'yyyy-MM-dd'),
        mealType: selectedMealType,
      });
      setShowFoodLogger(false);
    } catch (error) {
      console.error('Failed to log food:', error);
    }
  };

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snack', label: 'Snacks', icon: '🍎' },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">Track your daily nutrition and reach your goals.</p>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow px-6 py-4">
        <button
          onClick={handlePreviousDay}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Previous</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
            <span className="text-sm text-primary-600 font-medium">Today</span>
          )}
        </div>
        
        <button
          onClick={handleNextDay}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span>Next</span>
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Calorie Progress */}
      <CalorieProgress
        totalCalories={summary?.totalCalories || 0}
        goalCalories={user?.profile.dailyCalorieGoal || 2000}
        remainingCalories={remainingCalories}
      />

      {/* Meal Sections */}
      <div className="space-y-4">
        {mealTypes.map((meal) => {
          const mealLogs = logs.filter(log => log.mealType === meal.key);
          const mealCalories = summary?.breakdown[meal.key]?.calories || 0;
          
          return (
            <div key={meal.key} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{meal.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{meal.label}</h3>
                      <p className="text-sm text-gray-600">
                        {mealCalories} calories • {mealLogs.length} items
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFood(meal.key)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Food</span>
                  </button>
                </div>
              </div>
              
              <DailyFoodList
                logs={mealLogs}
                onDeleteLog={deleteFoodLog}
              />
            </div>
          );
        })}
      </div>

      {/* Food Logger Modal */}
      {showFoodLogger && (
        <FoodLogger
          isOpen={showFoodLogger}
          onClose={() => setShowFoodLogger(false)}
          onFoodLogged={handleFoodLogged}
          mealType={selectedMealType}
        />
      )}
    </div>
  );
};

export default Dashboard;
