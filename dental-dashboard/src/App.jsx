import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './components/Dashboard';
import Appointments from './components/admin/Appointments';
import Patients from './components/admin/Patients';
import CalendarView from './components/admin/CalendarView';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}>
        
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="calendar" element={<CalendarView />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;