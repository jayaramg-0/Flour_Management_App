import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import InventoryPage from './pages/owner/InventoryPage';
import SalesPage from './pages/owner/SalesPage';
import ProfitLossPage from './pages/owner/ProfitLossPage';
import DebtsPage from './pages/owner/DebtsPage';
import UsersPage from './pages/owner/UsersPage';
import FeedbackPage from './pages/owner/FeedbackPage';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import ReservePage from './pages/customer/ReservePage';
import HistoryPage from './pages/customer/HistoryPage';
import CustomerFeedback from './pages/customer/FeedbackPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Owner Routes */}
            <Route path="/owner/dashboard" element={
              <ProtectedRoute role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/owner/inventory" element={
              <ProtectedRoute role="owner">
                <InventoryPage />
              </ProtectedRoute>
            } />
            <Route path="/owner/sales" element={
              <ProtectedRoute role="owner">
                <SalesPage />
              </ProtectedRoute>
            } />
            <Route path="/owner/profit-loss" element={
              <ProtectedRoute role="owner">
                <ProfitLossPage />
              </ProtectedRoute>
            } />
            <Route path="/owner/debts" element={
              <ProtectedRoute role="owner">
                <DebtsPage />
              </ProtectedRoute>
            } />
            <Route path="/owner/users" element={
              <ProtectedRoute role="owner">
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/owner/feedback" element={
              <ProtectedRoute role="owner">
                <FeedbackPage />
              </ProtectedRoute>
            } />

            {/* Protected Customer Routes */}
            <Route path="/customer/dashboard" element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/customer/reserve" element={
              <ProtectedRoute role="customer">
                <ReservePage />
              </ProtectedRoute>
            } />
            <Route path="/customer/history" element={
              <ProtectedRoute role="customer">
                <HistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/customer/feedback" element={
              <ProtectedRoute role="customer">
                <CustomerFeedback />
              </ProtectedRoute>
            } />

            {/* Shared Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
