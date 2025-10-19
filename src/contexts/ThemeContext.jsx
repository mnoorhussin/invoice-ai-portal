import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to false (light mode)
    try {
      const savedTheme = localStorage.getItem('theme');
      console.log('Initial theme from localStorage:', savedTheme);
      // If no saved theme, default to light mode (false)
      return savedTheme === 'dark';
    } catch (error) {
      console.log('localStorage not available, defaulting to light mode');
      return false;
    }
  });

  useEffect(() => {
    // Apply theme to document and save to localStorage
    const html = document.documentElement;
    
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};