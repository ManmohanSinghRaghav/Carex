import { useState, useCallback } from 'react';
import { Food } from '../types';
import apiService from '../services/api';

export const useFoodSearch = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });

  const searchFoods = useCallback(async (
    query: string,
    category?: string,
    page = 1
  ) => {
    if (!query.trim()) {
      setFoods([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.searchFoods(query, category, page);
      setFoods(response.foods);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search foods');
      setFoods([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreFoods = async (
    query: string,
    category?: string,
    nextPage?: number
  ) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const page = nextPage || pagination.page + 1;
      const response = await apiService.searchFoods(query, category, page);
      setFoods(prev => [...prev, ...response.foods]);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load more foods');
    } finally {
      setIsLoading(false);
    }
  };

  const createFood = async (foodData: Partial<Food>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.createFood(foodData);
      return response.food;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create food');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = useCallback(() => {
    setFoods([]);
    setPagination({
      total: 0,
      page: 1,
      limit: 20,
      pages: 0,
    });
    setError(null);
  }, []);

  return {
    foods,
    isLoading,
    error,
    pagination,
    searchFoods,
    loadMoreFoods,
    createFood,
    clearResults,
  };
};
