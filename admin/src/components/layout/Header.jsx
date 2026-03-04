import { BRAND } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function Header({ onMenuClick }) {
  const { logout } = useAuth();

  return (
    <header className="bg-[#1B2A4A] text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/10"
          onClick={onMenuClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src={BRAND.logo} alt="Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
        <span className="font-bold text-sm sm:text-base truncate">{BRAND.name}</span>
        <span className="hidden sm:inline text-xs text-white/60 ml-2">Admin</span>
      </div>
      <Button variant="danger" size="sm" onClick={logout} className="flex-shrink-0">
        Logout
      </Button>
    </header>
  );
}
