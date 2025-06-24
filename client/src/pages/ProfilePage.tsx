import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.profile.age || '',
    gender: user?.profile.gender || '',
    weight: user?.profile.weight || '',
    height: user?.profile.height || '',
    activityLevel: user?.profile.activityLevel || 'moderately_active',
    goal: user?.profile.goal || 'maintain_weight',
    dailyCalorieGoal: user?.profile.dailyCalorieGoal || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const calculateBMI = () => {
    if (!formData.weight || !formData.height) return null;
    const weightKg = parseFloat(formData.weight.toString());
    const heightM = parseFloat(formData.height.toString()) / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        age: formData.age ? parseInt(formData.age.toString()) : undefined,
        gender: formData.gender || undefined,
        weight: formData.weight ? parseFloat(formData.weight.toString()) : undefined,
        height: formData.height ? parseInt(formData.height.toString()) : undefined,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dailyCalorieGoal: formData.dailyCalorieGoal ? parseInt(formData.dailyCalorieGoal.toString()) : undefined,
      };

      const response = await apiService.updateProfile(profileData);
      updateUser(response.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and health goals</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="text-sm text-green-700">{success}</div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Physical Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="13"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    min="20"
                    max="500"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    min="100"
                    max="250"
                    value={formData.height}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Activity Level */}
              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="lightly_active">Lightly active (light exercise 1-3 days/week)</option>
                  <option value="moderately_active">Moderately active (moderate exercise 3-5 days/week)</option>
                  <option value="very_active">Very active (hard exercise 6-7 days/week)</option>
                  <option value="extra_active">Extra active (very hard exercise, physical job)</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                  Health Goal
                </label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="lose_weight">Lose weight</option>
                  <option value="maintain_weight">Maintain weight</option>
                  <option value="gain_weight">Gain weight</option>
                </select>
              </div>

              {/* Daily Calorie Goal */}
              <div>
                <label htmlFor="dailyCalorieGoal" className="block text-sm font-medium text-gray-700">
                  Daily Calorie Goal
                </label>
                <input
                  type="number"
                  id="dailyCalorieGoal"
                  name="dailyCalorieGoal"
                  min="800"
                  max="5000"
                  value={formData.dailyCalorieGoal}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Form Actions */}
              {isEditing && (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setSuccess('');
                      // Reset form to original values
                      setFormData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        age: user?.profile.age || '',
                        gender: user?.profile.gender || '',
                        weight: user?.profile.weight || '',
                        height: user?.profile.height || '',
                        activityLevel: user?.profile.activityLevel || 'moderately_active',
                        goal: user?.profile.goal || 'maintain_weight',
                        dailyCalorieGoal: user?.profile.dailyCalorieGoal || '',
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* BMI Card */}
          {bmi && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">BMI</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-primary-600">{bmi}</span>
                </div>
                {bmiInfo && (
                  <p className={`text-sm mt-1 ${bmiInfo.color}`}>
                    {bmiInfo.category}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Email</span>
                <p className="text-sm text-gray-900">{user?.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Member since</span>
                <p className="text-sm text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {user?.profile.dailyCalorieGoal && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Goals</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Calories</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.profile.dailyCalorieGoal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Goal</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {user.profile.goal?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Activity Level</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {user.profile.activityLevel?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
