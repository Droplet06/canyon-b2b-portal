// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import SuccessPage from './pages/SuccessPage';
import HistoryPage from './pages/HistoryPage';

const NotFoundPage = () => (
  <div className="p-4 bg-slate-50 min-h-screen text-slate-800 font-sans flex items-center justify-center">
    <h1 className="text-xl font-bold">404 - Page Not Found</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes (Authenticated Users Only) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/catalog" replace />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;