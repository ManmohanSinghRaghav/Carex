import React from 'react';

interface CalorieProgressProps {
  totalCalories: number;
  goalCalories: number;
  remainingCalories: number;
}

const CalorieProgress: React.FC<CalorieProgressProps> = ({
  totalCalories,
  goalCalories,
  remainingCalories,
}) => {
  const percentage = Math.min((totalCalories / goalCalories) * 100, 100);
  const isOverGoal = totalCalories > goalCalories;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Daily Calorie Goal</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {totalCalories.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">of {goalCalories.toLocaleString()} calories</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${percentage}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
              isOverGoal
                ? 'bg-red-500'
                : percentage >= 80
                ? 'bg-yellow-500'
                : 'bg-primary-500'
            }`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            {totalCalories.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Consumed</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className={`text-lg font-semibold ${
            remainingCalories < 0 ? 'text-red-600' : 'text-primary-600'
          }`}>
            {remainingCalories < 0 ? '+' : ''}{Math.abs(remainingCalories).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            {remainingCalories < 0 ? 'Over Goal' : 'Remaining'}
          </div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            {goalCalories.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Goal</div>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-4 text-center">
        {isOverGoal ? (
          <p className="text-sm text-red-600">
            You've exceeded your daily calorie goal by {(totalCalories - goalCalories).toLocaleString()} calories.
          </p>
        ) : remainingCalories <= 200 && remainingCalories > 0 ? (
          <p className="text-sm text-yellow-600">
            You're close to your goal! {remainingCalories.toLocaleString()} calories remaining.
          </p>
        ) : remainingCalories > 0 ? (
          <p className="text-sm text-primary-600">
            You have {remainingCalories.toLocaleString()} calories remaining for today.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default CalorieProgress;
