import React, { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, parseISO } from 'date-fns';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatsPage: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.getStats(period);
      setStats(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Generate line chart data
  const generateLineChartData = () => {
    if (!stats?.stats) return null;

    const dailyGoal = user?.profile.dailyCalorieGoal || 2000;
    
    // Fill in missing days with 0 calories
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const dates = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      return format(date, 'yyyy-MM-dd');
    });

    const dataMap = new Map(stats.stats.map((stat: any) => [stat._id, stat.totalCalories]));
    const calories = dates.map(date => dataMap.get(date) || 0);
    const goals = new Array(days).fill(dailyGoal);

    return {
      labels: dates.map(date => format(parseISO(date), period === 'week' ? 'EEE' : 'MMM dd')),
      datasets: [
        {
          label: 'Calories Consumed',
          data: calories,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Daily Goal',
          data: goals,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderDash: [5, 5],
          tension: 0,
          fill: false,
        },
      ],
    };
  };

  // Generate bar chart data for weekly comparison
  const generateBarChartData = () => {
    if (!stats?.stats || period !== 'week') return null;

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, 'yyyy-MM-dd');
    });

    const dataMap = new Map(stats.stats.map((stat: any) => [stat._id, stat.totalCalories]));
    const calories = last7Days.map(date => dataMap.get(date) || 0);

    return {
      labels: daysOfWeek,
      datasets: [
        {
          label: 'Daily Calories',
          data: calories,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(20, 184, 166, 0.8)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(34, 197, 94)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(147, 51, 234)',
            'rgb(236, 72, 153)',
            'rgb(20, 184, 166)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  // Generate doughnut chart for goal achievement
  const generateDoughnutData = () => {
    if (!stats?.averageCalories || !user?.profile.dailyCalorieGoal) return null;

    const dailyGoal = user.profile.dailyCalorieGoal;
    const averageCalories = Math.round(stats.averageCalories);
    const remaining = Math.max(0, dailyGoal - averageCalories);
    const excess = Math.max(0, averageCalories - dailyGoal);

    return {
      labels: excess > 0 ? ['Consumed', 'Excess'] : ['Consumed', 'Remaining'],
      datasets: [
        {
          data: excess > 0 ? [dailyGoal, excess] : [averageCalories, remaining],
          backgroundColor: excess > 0 
            ? ['rgb(239, 68, 68)', 'rgb(251, 146, 60)']
            : ['rgb(34, 197, 94)', 'rgb(229, 231, 235)'],
          borderColor: excess > 0
            ? ['rgb(220, 38, 38)', 'rgb(245, 101, 101)']
            : ['rgb(21, 128, 61)', 'rgb(209, 213, 219)'],
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const lineChartData = generateLineChartData();
  const barChartData = generateBarChartData();
  const doughnutData = generateDoughnutData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600">Track your progress and analyze your eating patterns</p>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 font-bold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Daily Calories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.averageCalories || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Daily Goal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(user?.profile.dailyCalorieGoal || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">📈</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.stats?.filter((stat: any) => stat.totalCalories > 0).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        {lineChartData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Calorie Trend ({period})
            </h3>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        )}

        {/* Goal Achievement */}
        {doughnutData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Average Goal Achievement
            </h3>
            <div className="flex justify-center">
              <div className="w-64">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Average: {Math.round(stats.averageCalories || 0)} calories/day
              </p>
            </div>
          </div>
        )}

        {/* Weekly Bar Chart */}
        {barChartData && period === 'week' && (
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Breakdown (This Week)
            </h3>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Insights */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
          <div className="space-y-3">
            {stats.averageCalories && user?.profile.dailyCalorieGoal && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  {stats.averageCalories > user.profile.dailyCalorieGoal
                    ? `You're consuming an average of ${Math.round(stats.averageCalories - user.profile.dailyCalorieGoal)} calories above your daily goal.`
                    : stats.averageCalories < user.profile.dailyCalorieGoal * 0.8
                    ? `You're consuming an average of ${Math.round(user.profile.dailyCalorieGoal - stats.averageCalories)} calories below your daily goal. Consider adding more nutritious foods.`
                    : `Great job! You're staying close to your daily calorie goal.`}
                </p>
              </div>
            )}
            
            {stats.stats && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  You've logged food on {stats.stats.filter((stat: any) => stat.totalCalories > 0).length} out of{' '}
                  {stats.stats.length} days in this {period}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
