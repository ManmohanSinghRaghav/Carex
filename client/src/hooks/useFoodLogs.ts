import { useState, useEffect } from 'react';
import { FoodLog, DailySummary } from '../types';
import apiService from '../services/api';
import { format } from 'date-fns';

export const useFoodLogs = (selectedDate?: Date) => {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [remainingCalories, setRemainingCalories] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (date?: Date) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dateStr = date ? format(date, 'yyyy-MM-dd') : undefined;
      const response = await apiService.getDailyLogs(dateStr);
      
      setLogs(response.logs);
      setSummary(response.summary);
      setRemainingCalories(response.remainingCalories);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch food logs');
    } finally {
      setIsLoading(false);
    }
  };

  const addFoodLog = async (logData: {
    foodId: string;
    date: string;
    mealType: string;
    quantity: number;
    unit: string;
    totalCalories: number;
    notes?: string;
  }) => {
    try {
      const response = await apiService.createFoodLog(logData);
      setLogs(prev => [response.log, ...prev]);
      
      // Refresh to get updated summary
      await fetchLogs(selectedDate);
      
      return response.log;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add food log');
      throw err;
    }
  };

  const updateFoodLog = async (id: string, logData: any) => {
    try {
      const response = await apiService.updateFoodLog(id, logData);
      setLogs(prev => prev.map(log => log._id === id ? response.log : log));
      
      // Refresh to get updated summary
      await fetchLogs(selectedDate);
      
      return response.log;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update food log');
      throw err;
    }
  };

  const deleteFoodLog = async (id: string) => {
    try {
      await apiService.deleteFoodLog(id);
      setLogs(prev => prev.filter(log => log._id !== id));
      
      // Refresh to get updated summary
      await fetchLogs(selectedDate);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete food log');
      throw err;
    }
  };

  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate]);

  return {
    logs,
    summary,
    remainingCalories,
    isLoading,
    error,
    addFoodLog,
    updateFoodLog,
    deleteFoodLog,
    refetch: () => fetchLogs(selectedDate),
  };
};
