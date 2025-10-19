// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600 dark:text-white">{message}</p>
    </div>
  );
};

export default LoadingSpinner;