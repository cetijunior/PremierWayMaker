import { useAuth } from '../../hooks/useAuth';
import { HiBars3, HiArrowRightOnRectangle } from 'react-icons/hi2';

export default function Header({ onMenuClick }) {
  const { logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          aria-label="Open menu"
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={onMenuClick}
        >
          <HiBars3 className="w-6 h-6" />
        </button>
        <span className="font-semibold text-lg text-slate-800 truncate lg:hidden">Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={logout} 
          className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors"
        >
          <HiArrowRightOnRectangle className="w-5 h-5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
