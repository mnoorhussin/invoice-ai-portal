import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import AuthForm from './components/Auth/AuthForm';
import Upload from './pages/Upload';
import Invoices from './pages/Invoices';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Auth Route Component (redirect to dashboard if already logged in)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <Navigate to="/upload" replace /> : children;
};

// Main App Routes
const AppRoutes = () => {
  const { user, login, register, loading } = useAuth();
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError('');
    const result = await login(email, password);
    if (!result.success) {
      setAuthError(result.error);
    }
    setAuthLoading(false);
  };

  const handleRegister = async (email, password, name) => {
    setAuthLoading(true);
    setAuthError('');
    const result = await register(email, password, name);
    if (!result.success) {
      setAuthError(result.error);
    }
    setAuthLoading(false);
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <AuthForm 
              onLogin={handleLogin}
              onRegister={handleRegister}
              loading={authLoading}
              error={authError}
            />
          </AuthRoute>
        } 
      />
      
      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute>
            <Layout><Upload /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoices" 
        element={
          <ProtectedRoute>
            <Layout><Invoices /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Layout><Analytics /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;