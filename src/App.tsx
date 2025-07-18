import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProfileSetup } from './pages/ProfileSetup';
import { Dashboard } from './pages/Dashboard';
import { Fridge } from './pages/Fridge';
import { Recipes } from './pages/Recipes';
import { AdminDashboard } from './pages/AdminDashboard';
import { Privacy } from './pages/Privacy';
import { RecipeDetail } from './pages/RecipeDetail';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" replace />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Protected routes */}
          <Route path="/profiel-invullen" element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/koelkast" element={
            <ProtectedRoute>
              <Fridge />
            </ProtectedRoute>
          } />
          
          <Route path="/recepten" element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          } />
          
          <Route path="/recept/:id" element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/profiel" element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/beheer" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
