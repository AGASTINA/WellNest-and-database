import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ConsultDoctor from './pages/ConsultDoctor';
import MedicalRecords from './pages/MedicalRecords';
import HealthMetrics from './pages/HealthMetrics';
import FitnessGoals from './pages/FitnessGoals';
import MealTracker from './pages/MealTracker';
import Membership from './pages/Membership';
import SleepTracker from './pages/SleepTracker';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consult-doctor"
          element={
            <ProtectedRoute>
              <ConsultDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-records"
          element={
            <ProtectedRoute>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-metrics"
          element={
            <ProtectedRoute>
              <HealthMetrics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fitness-goals"
          element={
            <ProtectedRoute>
              <FitnessGoals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meal-tracker"
          element={
            <ProtectedRoute>
              <MealTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membership"
          element={
            <ProtectedRoute>
              <Membership />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sleep-tracker"
          element={
            <ProtectedRoute>
              <SleepTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
