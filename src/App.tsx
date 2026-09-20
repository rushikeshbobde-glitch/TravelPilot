import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { AppLayout } from './layouts/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { MapPage } from './pages/MapPage';
import { BudgetPage } from './pages/BudgetPage';
import { BookingsPage } from './pages/BookingsPage';
import { DisruptionsPage } from './pages/DisruptionsPage';
import { RiskRadarPage } from './pages/RiskRadarPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { AssistantPage } from './pages/AssistantPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isDemoMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-300">Loading TravelPilot Digital Twin...</span>
        </div>
      </div>
    );
  }

  // In demo mode, or when logged in, grant access
  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected App Routes inside Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/plan" element={<PlanTripPage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/disruptions" element={<DisruptionsPage />} />
              <Route path="/risk-radar" element={<RiskRadarPage />} />
              <Route path="/what-if" element={<WhatIfPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
};

export default App;
