// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Placeholder for future implementation
const HistoryPage = () => <div className="p-4"><h1>Order History (Coming Soon)</h1></div>;
const NotFoundPage = () => <div className="p-4"><h1>404 - Not Found</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/catalog" replace />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;