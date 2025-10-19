// src/components/Layout/GlassCard.jsx
import React from 'react';

const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-black/20 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;