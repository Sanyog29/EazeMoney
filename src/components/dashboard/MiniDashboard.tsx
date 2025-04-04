"use client";

import { useState, useEffect } from 'react';
import { useBanking } from '@/hooks/useBanking';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SpendingCategory {
  category: string;
  amount: number;
  color: string;
}

interface MonthlySpending {
  month: string;
  amount: number;
}

export default function MiniDashboard() {
  const { user } = useBanking();
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingCategory[]>([]);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch by only rendering on client
  useEffect(() => {
    setIsClient(true);
    
    if (user) {
      fetchSpendingData();
      
      // Set up polling for real-time updates (every 30 seconds)
      const intervalId = setInterval(fetchSpendingData, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const fetchSpendingData = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/spending?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch spending data');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSpendingByCategory(data.spendingByCategory);
      setMonthlySpending(data.monthlySpending);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching spending data:', err);
      setError(err.message);
      
      // Fallback to mock data if API fails
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Use fixed seed data instead of random to avoid hydration mismatch
    const categorySpending: SpendingCategory[] = [
      { category: 'Groceries', amount: 450, color: 'rgb(255, 99, 132)' },
      { category: 'Entertainment', amount: 300, color: 'rgb(54, 162, 235)' },
      { category: 'Bills', amount: 650, color: 'rgb(255, 206, 86)' },
      { category: 'Shopping', amount: 200, color: 'rgb(75, 192, 192)' },
      { category: 'Other', amount: 150, color: 'rgb(153, 102, 255)' }
    ];

    // Fixed monthly data
    const monthly: MonthlySpending[] = [
      { month: 'Jan', amount: 1200 },
      { month: 'Feb', amount: 1500 },
      { month: 'Mar', amount: 1100 },
      { month: 'Apr', amount: 1800 },
      { month: 'May', amount: 1300 },
      { month: 'Jun', amount: 1600 }
    ];

    setSpendingByCategory(categorySpending);
    setMonthlySpending(monthly);
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
      <h2 className="text-xl font-semibold mb-4">Spending Analysis</h2>
      <div className="h-40"></div>
    </div>;
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-4">Spending Analysis</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-4">Spending Analysis</h2>
        <div className="bg-red-900/50 border border-red-500 rounded-md p-3 text-red-200 mb-4">
          {error}
        </div>
        <p className="text-gray-400">Using mock data for demonstration.</p>
        {renderCharts()}
      </div>
    );
  }

  if (!user || !spendingByCategory.length || !monthlySpending.length) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-4">Spending Analysis</h2>
        <p className="text-gray-400">No spending data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Spending Analysis</h2>
        <button 
          onClick={fetchSpendingData}
          className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
        >
          Refresh
        </button>
      </div>
      
      {renderCharts()}
    </div>
  );

  function renderCharts() {
    const pieChartData = {
      labels: spendingByCategory.map(item => item.category),
      datasets: [
        {
          data: spendingByCategory.map(item => item.amount),
          backgroundColor: spendingByCategory.map(item => item.color),
          borderWidth: 1,
        },
      ],
    };

    const barChartData = {
      labels: monthlySpending.map(item => item.month),
      datasets: [
        {
          label: 'Monthly Spending (₹)',
          data: monthlySpending.map(item => item.amount),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Spending by Category</h3>
          <div className="h-64">
            <Pie 
              data={pieChartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed !== undefined) {
                          label += '₹' + context.parsed;
                        }
                        return label;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Monthly Spending</h3>
          <div className="h-64">
            <Bar 
              data={barChartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      callback: function(value) {
                        return '₹' + value;
                      }
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  x: {
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    );
  }
}