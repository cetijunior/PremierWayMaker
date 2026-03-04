import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Applications' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40
          w-56 bg-[#1B2A4A]/98 md:bg-[#1B2A4A]/95 text-white
          min-h-0 flex-shrink-0
          transform transition-transform duration-200 ease-out
          md:transform-none
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <nav className="py-4 pt-16 md:pt-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
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
    </>
  );
}
