// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext'; // 1. 导入新的 Provider
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
        {/* 2. 用 OrderProvider 包裹所有路由 */}
        <OrderProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/catalog" replace />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </OrderProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;