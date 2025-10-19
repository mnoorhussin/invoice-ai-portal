// src/pages/Analytics.jsx
import React, { useMemo, useState } from 'react';
import { useInvoices } from '../hooks/useInvoices';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import GlassCard from '../components/Layout/GlassCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

const Analytics = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { invoices, loading } = useInvoices(user?.uid);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  // Compute metrics
  const metrics = useMemo(() => {
    const filteredInvoices = invoices.filter(inv => {
      if (!dateRange.startDate || !dateRange.endDate) return true;
      const invoiceDate = new Date(inv.createdAt);
      return invoiceDate >= dateRange.startDate && invoiceDate <= dateRange.endDate;
    });

    const totalInvoices = filteredInvoices.length;
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const statusCounts = filteredInvoices.reduce(
      (acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      },
      { Paid: 0, Pending: 0, Overdue: 0 }
    );
    const overdueInvoices = filteredInvoices.filter(inv => inv.status === 'Overdue');
    const averageAmount = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    return { totalInvoices, totalRevenue, statusCounts, overdueInvoices, averageAmount, filteredInvoices };
  }, [invoices, dateRange]);

  // Chart data configurations
  const pieData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        label: 'Invoices Status',
        data: [
          metrics.statusCounts.Paid,
          metrics.statusCounts.Pending,
          metrics.statusCounts.Overdue,
        ],
        backgroundColor: ['#34D399', '#FBBF24', '#F87171'],
        hoverOffset: 10,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? 'white' : '#374151',
        },
      },
    },
  };

  const lineData = {
    labels: metrics.filteredInvoices.map(inv => new Date(inv.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Invoice Amounts',
        data: metrics.filteredInvoices.map(inv => inv.amount),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? 'white' : '#374151',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? 'white' : '#374151',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? 'white' : '#374151',
        }, 
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
   <div className="h-full p-8 flex flex-col">
      <header className="mb-8">
       <h1 
         className="text-3xl font-bold text-gray-800 dark:text-white"
         style={{ color: isDarkMode ? 'white' : undefined }}
       >
         Analytics Dashboard
       </h1>
       <p 
         className="mt-1 text-gray-600 dark:text-white"
         style={{ color: isDarkMode ? 'white' : undefined }}
       >
         Visualize your invoice data and key metrics.
       </p>
      </header>
      <GlassCard className="p-6 mb-6 flex flex-wrap gap-6" style={{ color: isDarkMode ? 'white' : undefined }}>
        <div className="w-full flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label 
              className="text-gray-600 dark:text-white"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              From:
            </label>
            <DatePicker
              selected={dateRange.startDate}
              onChange={(date) => setDateRange({...dateRange, startDate: date})}
              selectsStart
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              className="bg-white/50 dark:bg-gray-800 p-2 rounded border border-gray-300 text-gray-800 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label 
              className="text-gray-600 dark:text-white"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              To:
            </label>
            <DatePicker
              selected={dateRange.endDate}
              onChange={(date) => setDateRange({...dateRange, endDate: date})}
              selectsEnd
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              minDate={dateRange.startDate}
              className="bg-white/50 dark:bg-gray-800 p-2 rounded border border-gray-300 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Calculating analytics..." />
        ) : (
          <>
            <div 
              className="flex-1 bg-white/20 dark:bg-gray-800/50 p-4 rounded shadow flex flex-col items-center"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              <p 
                className="text-gray-600 dark:text-white"
                style={{ color: isDarkMode ? 'white' : undefined }}
              >
                Total Invoices
              </p>
              <span 
                className="text-3xl font-bold text-gray-800 dark:text-white"
                style={{ color: isDarkMode ? 'white' : undefined }}
              >
                {metrics.totalInvoices}
              </span>
            </div>
            <div 
              className="flex-1 bg-white/20 dark:bg-gray-800/50 p-4 rounded shadow flex flex-col items-center"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              <p 
                className="text-gray-600 dark:text-white"
                style={{ color: isDarkMode ? 'white' : undefined }}
              >
                Total Revenue
              </p>
              <span 
                className="text-3xl font-bold text-gray-800 dark:text-white"
                style={{ color: isDarkMode ? 'white' : undefined }}
              >
                {metrics.totalRevenue ? `$${metrics.totalRevenue.toFixed(2)}` : '$0.00'}
              </span>
            </div>
            <div 
              className="flex-1 bg-white/20 dark:bg-gray-800/50 p-4 rounded shadow flex flex-col items-center"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              <p 
                className="text-gray-600 dark:text-white"
                style={{ color: isDarkMode ? 'white' : undefined }}
              >
                Overdue Invoices
              </p>
              <span 
                className="text-3xl font-bold text-gray-800 dark:text-white"
                style={{ color: isDarkMode ? 'white' : undefined }}
              >
                {metrics.overdueInvoices.length}
              </span>
            </div>
            <div 
              className="flex-1 bg-white/20 dark:bg-gray-800/50 p-4 rounded shadow flex flex-col items-center"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              <p 
                className="text-gray-600 dark:text-white"
                style={{ color: isDarkMode ? 'white' : undefined }}
              >
                Average Amount
              </p>
              <span 
                className="text-3xl font-bold text-gray-800 dark:text-white"
                style={{ color: isDarkMode ? 'white' : undefined }}
              >
                {metrics.averageAmount ? `$${metrics.averageAmount.toFixed(2)}` : '$0.00'}
              </span>
            </div>
          </>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard 
          className="p-6 flex flex-col items-center"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          <h2 
            className="text-xl font-semibold mb-4 text-gray-800 dark:text-white"
            style={{ color: isDarkMode ? '#ffffff' : undefined }}
          >
            Invoices Status Breakdown
          </h2>
          {loading ? (
            <LoadingSpinner message="Loading chart..." />
          ) : invoices.length === 0 ? (
            <p 
              className="text-gray-600 dark:text-white"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              No invoice data to display.
            </p>
          ) : (
            <div className="w-full max-w-md">
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </GlassCard>

        <GlassCard 
          className="p-6 flex flex-col items-center"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          <h2 
            className="text-xl font-semibold mb-4 text-gray-800 dark:text-white"
            style={{ color: isDarkMode ? 'white' : undefined }}
          >
            Revenue Trend
          </h2>
          {loading ? (
            <LoadingSpinner message="Loading chart..." />
          ) : invoices.length === 0 ? (
            <p 
              className="text-gray-600 dark:text-white"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              No invoice data to display.
            </p>
          ) : (
            <div className="w-full">
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
