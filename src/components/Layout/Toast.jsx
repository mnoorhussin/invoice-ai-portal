// src/components/Layout/Toast.jsx
import React from 'react';

const Toast = ({ message, visible, type = 'success' }) => {
  const bgColor = type === 'success' 
    ? 'bg-green-500/80 dark:bg-green-400/80 text-white dark:text-gray-900' 
    : 'bg-red-500/80 dark:bg-red-400/80 text-white';

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}
    >
      <div className={`backdrop-blur-sm font-semibold px-6 py-3 rounded-xl shadow-lg ${bgColor}`}>
        {message}
      </div>
    </div>
  );
};

export default Toast;