import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('healthify_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('healthify_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // User endpoints
  async updateProfile(profileData: any) {
    const response = await this.api.put('/users/profile', profileData);
    return response.data;
  }

  // Food endpoints
  async searchFoods(query: string, category?: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category && category !== 'all') {
      params.append('category', category);
    }

    const response = await this.api.get(`/foods/search?${params}`);
    return response.data;
  }

  async getFood(id: string) {
    const response = await this.api.get(`/foods/${id}`);
    return response.data;
  }

  async createFood(foodData: any) {
    const response = await this.api.post('/foods', foodData);
    return response.data;
  }

  async getFoodCategories() {
    const response = await this.api.get('/foods/meta/categories');
    return response.data;
  }

  // Food log endpoints
  async getDailyLogs(date?: string) {
    const params = date ? `?date=${date}` : '';
    const response = await this.api.get(`/logs/daily${params}`);
    return response.data;
  }

  async createFoodLog(logData: {
    foodId: string;
    date: string;
    mealType: string;
    quantity: number;
    unit: string;
    totalCalories: number;
    notes?: string;
  }) {
    const response = await this.api.post('/logs', logData);
    return response.data;
  }

  async updateFoodLog(id: string, logData: any) {
    const response = await this.api.put(`/logs/${id}`, logData);
    return response.data;
  }

  async deleteFoodLog(id: string) {
    const response = await this.api.delete(`/logs/${id}`);
    return response.data;
  }

  async getStats(period = 'week') {
    const response = await this.api.get(`/logs/stats?period=${period}`);
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;
