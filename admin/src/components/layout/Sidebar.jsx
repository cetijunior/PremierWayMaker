import { NavLink } from 'react-router-dom';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { BRAND } from '../../constants';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Applications', icon: HiOutlineDocumentText },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200
        w-64 min-h-0 flex-shrink-0 flex flex-col items-center py-6
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}
    >
      <div className="flex items-center gap-3 w-full px-8 mb-10">
        <img src={BRAND.logo} alt="Logo" className="w-10 h-10 rounded-full flex-shrink-0" />
        <span className="font-bold text-lg text-slate-800 truncate">{BRAND.name}</span>
      </div>
      
      <nav className="w-full flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
