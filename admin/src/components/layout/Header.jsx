import { BRAND } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="bg-[#1B2A4A] text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={BRAND.logo} alt="Logo" className="w-8 h-8 rounded-full" />
        <span className="font-bold text-base">{BRAND.name}</span>
        <span className="text-xs text-white/60 ml-2">Admin</span>
      </div>
      <Button variant="danger" size="sm" onClick={logout}>
        Logout
      </Button>
    </header>
  );
}
