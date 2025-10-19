// src/pages/Invoices.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInvoices } from '../hooks/useInvoices';
import { useTheme } from '../contexts/ThemeContext';
import GlassCard from '../components/Layout/GlassCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  let colorClasses = "";
  switch (status) {
    case 'Paid': 
      colorClasses = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'; 
      break;
    case 'Pending': 
      colorClasses = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'; 
      break;
    case 'Overdue': 
      colorClasses = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'; 
      break;
    default: 
      colorClasses = 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100';
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

const Invoices = () => {
  const { user } = useAuth();
  const { invoices, loading } = useInvoices(user?.uid);
  const { isDarkMode } = useTheme();

  return (
    <div className="h-full p-8 flex flex-col">
      <header className="mb-8">
        <h1 
          className="text-3xl font-bold text-gray-800 dark:text-white"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          All Invoices
        </h1>
        <p 
          className="mt-1 text-gray-600 dark:text-white"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          Search, filter, and manage your invoices.
        </p>
      </header>

      <GlassCard className="p-4 flex-grow overflow-hidden" style={{ color: isDarkMode ? 'white' : undefined }}>
        <div className="overflow-y-auto h-full">
          {loading ? (
            <LoadingSpinner message="Loading invoices..." />
          ) : invoices.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600 dark:text-white" style={{ color: isDarkMode ? 'white' : undefined }}>No invoices found. Upload your first invoice!</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-800 dark:text-white">
              <thead className="sticky top-0 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm">
                <tr>
                  <th className="p-3 font-semibold text-gray-800 dark:text-white">Vendor</th>
                  <th className="p-3 font-semibold text-gray-800 dark:text-white">Amount</th>
                  <th className="p-3 font-semibold text-gray-800 dark:text-white">Due Date</th>
                  <th className="p-3 font-semibold text-gray-800 dark:text-white">Status</th>
                  <th className="p-3 font-semibold text-gray-800 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="p-3 text-gray-800 dark:text-white" style={{ color: isDarkMode ? 'white' : undefined }}>{invoice.vendor}</td>
                    <td className="p-3 text-gray-800 dark:text-white" style={{ color: isDarkMode ? 'white' : undefined }}>{invoice.amount} {invoice.currency || 'USD'}</td>
                    <td className="p-3 text-gray-800 dark:text-white" style={{ color: isDarkMode ? 'white' : undefined }}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="p-3 flex space-x-2">
                      <button
                        className="px-3 py-1 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                        onClick={() => console.log('View', invoice.id)}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-red-600 dark:bg-red-500 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition"
                        onClick={() => console.log('Delete', invoice.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Invoices;
