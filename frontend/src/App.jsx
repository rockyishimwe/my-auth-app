import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GoalsProvider, useGoals } from './contexts/GoalsContext';
import { UIProvider, useUI } from './contexts/GoalsContext';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import './styles/variables.css';

// Import pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GoalDetailPage from './pages/GoalDetailPage';
import GoalsListPage from './pages/GoalsListPage';
import ContextsPage from './pages/ContextsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

// Layout Component
const Layout = ({ children }) => {
  const { sidebarCollapsed } = useUI();
  
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'JetBrains Mono, monospace' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? '48px' : '250px',
        background: 'var(--bg)',
        overflow: 'auto',
        transition: 'margin-left var(--transition-normal)'
      }}>
        {children}
      </main>
      <Toast />
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/goals" element={
          <ProtectedRoute>
            <Layout>
              <GoalsListPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/goals/:id" element={
          <ProtectedRoute>
            <Layout>
              <GoalDetailPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/contexts" element={
          <ProtectedRoute>
            <Layout>
              <ContextsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <GoalsProvider>
          <AppContent />
        </GoalsProvider>
      </AuthProvider>
    </UIProvider>
  );
}
