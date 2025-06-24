import React from 'react';
import { FoodLog } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DailyFoodListProps {
  logs: FoodLog[];
  onDeleteLog: (id: string) => void;
}

const DailyFoodList: React.FC<DailyFoodListProps> = ({ logs, onDeleteLog }) => {
  if (logs.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        <p>No food logged for this meal yet.</p>
        <p className="text-sm mt-1">Click "Add Food" to get started!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {logs.map((log) => (
        <div key={log._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {log.foodId.name}
                    {log.foodId.brand && (
                      <span className="text-gray-500 ml-2">({log.foodId.brand})</span>
                    )}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {log.quantity} {log.unit}
                    </span>
                    <span className="text-sm font-medium text-primary-600">
                      {log.totalCalories} calories
                    </span>
                    {log.foodId.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {log.foodId.category.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-sm text-gray-500 mt-1">{log.notes}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onDeleteLog(log._id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete food log"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyFoodList;
