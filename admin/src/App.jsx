import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* DEMO: Redirect to dashboard for client preview – restore with: to="/login" */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
