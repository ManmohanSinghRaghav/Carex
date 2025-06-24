import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import apiService from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('carex_token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await apiService.getProfile();
          dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
        } catch (error) {
          localStorage.removeItem('carex_token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: '' });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response: AuthResponse = await apiService.login({ email, password });
      
      localStorage.setItem('carex_token', response.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response: AuthResponse = await apiService.register(userData);
      
      localStorage.setItem('carex_token', response.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('carex_token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      dispatch({ type: 'UPDATE_USER', payload: { ...state.user, ...userData } });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
