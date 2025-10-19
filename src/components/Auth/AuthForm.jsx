// src/components/Auth/AuthForm.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icons } from '../common/Icons';
import GlassCard from '../Layout/GlassCard';

const AuthForm = ({ onLogin, onRegister, loading, error }) => {
  const { isDarkMode } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      return;
    }

    if (isLogin) {
      onLogin(formData.email, formData.password);
    } else {
      onRegister(formData.email, formData.password, formData.name);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb' }}>
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
        style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }}
      />

      <GlassCard className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-2xl">AI</span>
          </div>
          <h1 
            className="text-2xl font-bold"
            style={{ color: isDarkMode ? 'white' : '#1f2937' }}
          >
            InvoiceAI
          </h1>
        </div>

        {/* Form Title */}
        <h2 
          className="text-xl font-semibold text-center mb-6"
          style={{ color: isDarkMode ? 'white' : '#374151' }}
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Register only) */}
          {!isLogin && (
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: isDarkMode ? 'white' : '#374151' }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ 
                  color: isDarkMode ? 'white' : '#374151',
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)'
                }}
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? 'white' : '#374151' }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              style={{ 
                color: isDarkMode ? 'white' : '#374151',
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)'
              }}
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? 'white' : '#374151' }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              style={{ 
                color: isDarkMode ? 'white' : '#374151',
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)'
              }}
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password Field (Register only) */}
          {!isLogin && (
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: isDarkMode ? 'white' : '#374151' }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ 
                  color: isDarkMode ? 'white' : '#374151',
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)'
                }}
                placeholder="Confirm your password"
              />
              {!isLogin && formData.password !== formData.confirmPassword && formData.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">Passwords don't match</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (!isLogin && formData.password !== formData.confirmPassword)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {isLogin ? Icons.login : Icons.userPlus}
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Form */}
        <div className="mt-6 text-center">
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#6b7280' }}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-600 font-medium text-sm mt-1 transition-colors"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default AuthForm;
