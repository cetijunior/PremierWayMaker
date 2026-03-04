import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EC]">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto min-w-0">
          <Outlet />
        </main>
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
