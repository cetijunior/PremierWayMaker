import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Applications' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-[#1B2A4A]/95 text-white min-h-0 flex-shrink-0">
      <nav className="py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-6 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-[#F5B731] font-semibold'
                  : 'text-white/70 hover:bg-white/5'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
