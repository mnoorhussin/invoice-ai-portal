// src/components/Layout/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../common/Icons';
import GlassCard from './GlassCard';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Upload', path: '/upload', icon: Icons.upload },
    { name: 'Invoices', path: '/invoices', icon: Icons.invoices },
    { name: 'Analytics', path: '/analytics', icon: Icons.analytics },
    { name: 'Settings', path: '/settings', icon: Icons.settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <GlassCard className="h-full p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-xl">AI</span>
          </div>
          <h1 
            className="text-xl font-bold text-gray-800 dark:text-white"
            style={{ color: isDarkMode ? 'white' : undefined }}
          >
            InvoiceAI
          </h1>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-600 dark:text-white ${
                isActive(item.path)
                  ? 'bg-blue-500/20 text-blue-500'
                  : 'hover:bg-gray-500/10'
              }`}
              style={{
                color: isActive(item.path) 
                  ? '#3b82f6' 
                  : (isDarkMode ? 'white' : undefined)
              }}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500/10 transition-all duration-300 text-gray-600 dark:text-white"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          {isDarkMode ? Icons.sun : Icons.moon}
          <span className="font-medium">Toggle Theme</span>
        </button>
        <div className="border-t border-white/20 my-2"></div>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="font-bold text-white text-sm">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p 
              className="font-semibold text-sm text-gray-800 dark:text-white truncate"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              {user?.displayName || userProfile?.name || 'User'}
            </p>
            <p 
              className="text-xs text-gray-500 dark:text-white truncate"
              style={{ color: isDarkMode ? 'white' : undefined }}
            >
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-all duration-300 text-red-500 hover:text-red-600 w-full"
        >
          {Icons.logout}
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </GlassCard>
  );
};

export default Sidebar;