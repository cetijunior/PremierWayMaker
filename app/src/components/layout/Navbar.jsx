import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { BRAND } from '../../constants/brand';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const links = [
    { to: '/apply/inside', label: t('nav.apply') },
  ];

  function handleHomeClick(e) {
    e.preventDefault();
    setMobileOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  }

  function scrollToSection(id) {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a
            href="/"
            onClick={handleHomeClick}
            className="flex items-center gap-3 text-white font-bold text-lg group cursor-pointer"
          >
            <img
              src={BRAND.logo}
              alt="Logo"
              className="w-9 h-9 rounded-full ring-2 ring-gold/40 group-hover:ring-gold transition-all"
            />
            <span className="hidden sm:inline">{BRAND.name}</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              onClick={handleHomeClick}
              className="text-white/80 text-sm font-medium hover:text-gold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold after:transition-all hover:after:w-full cursor-pointer"
            >
              {t('nav.home')}
            </a>
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/80 text-sm font-medium hover:text-gold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            {isHome && (
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white/80 text-sm font-medium hover:text-gold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold after:transition-all hover:after:w-full"
              >
                {t('nav.contact')}
              </button>
            )}
            <LanguageSwitcher />
          </div>

          <div className="flex md:hidden items-center gap-3">
            <LanguageSwitcher compact />
            <button
              onClick={() => setMobileOpen(true)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <HiBars3 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-998"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-navy shadow-2xl z-999 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
                <span className="text-white font-bold">{BRAND.name}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-4">
                <a
                  href="/"
                  onClick={handleHomeClick}
                  className="text-white/80 hover:text-gold hover:bg-white/5 px-4 py-3 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  {t('nav.home')}
                </a>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 hover:text-gold hover:bg-white/5 px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                {isHome && (
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-left text-white/80 hover:text-gold hover:bg-white/5 px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    {t('nav.contact')}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
