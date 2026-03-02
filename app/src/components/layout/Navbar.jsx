import { Link } from 'react-router-dom';
import { BRAND } from '../../constants/brand';

export default function Navbar() {
  return (
    <nav className="bg-[#1B2A4A] py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-lg">
          <img src={BRAND.logo} alt="Logo" className="w-10 h-10 rounded-full" />
          {BRAND.name}
        </Link>
        <ul className="flex gap-5 list-none">
          <li>
            <Link to="/" className="text-[#F4F1EC] text-sm hover:text-[#F5B731] transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/apply/inside" className="text-[#F4F1EC] text-sm hover:text-[#F5B731] transition-colors">
              Apply
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
