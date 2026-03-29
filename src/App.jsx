import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Features from './pages/Features';
import Login from './pages/Login';
import Register from './pages/Register';
import LeaderDashboard from './pages/leader/Dashboard';
import CreateExam from './pages/leader/CreateExam';
import ExamPreview from './pages/leader/ExamPreview';
import ExamList from './pages/leader/ExamList';
import ExamLink from './pages/leader/ExamLink';
import LeaderResults from './pages/leader/Results';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeExams from './pages/employee/Exams';
import TakeExam from './pages/employee/TakeExam';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'leader' ? '/leader/dashboard' : '/employee/dashboard'} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'leader' ? '/leader/dashboard' : '/employee/dashboard'} replace /> : <Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'leader' ? '/leader/dashboard' : '/employee/dashboard'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/employee/dashboard" replace /> : <Register />} />
      <Route path="/exam/:code" element={<TakeExam />} />

      <Route path="/leader/dashboard" element={<ProtectedRoute allowedRole="leader"><LeaderDashboard /></ProtectedRoute>} />
      <Route path="/leader/exam/create" element={<ProtectedRoute allowedRole="leader"><CreateExam /></ProtectedRoute>} />
      <Route path="/leader/exam/preview/:id" element={<ProtectedRoute allowedRole="leader"><ExamPreview /></ProtectedRoute>} />
      <Route path="/leader/exam/list" element={<ProtectedRoute allowedRole="leader"><ExamList /></ProtectedRoute>} />
      <Route path="/leader/exam/link/:id" element={<ProtectedRoute allowedRole="leader"><ExamLink /></ProtectedRoute>} />
      <Route path="/leader/results" element={<ProtectedRoute allowedRole="leader"><LeaderResults /></ProtectedRoute>} />

      <Route path="/employee/dashboard" element={<ProtectedRoute allowedRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/exams" element={<ProtectedRoute allowedRole="employee"><EmployeeExams /></ProtectedRoute>} />
      <Route path="/employee/exam/:id" element={<ProtectedRoute allowedRole="employee"><TakeExam /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#FAFBFC'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #E8ECF0',
    borderTopColor: '#4A90A4',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
};
