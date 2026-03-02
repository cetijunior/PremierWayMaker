import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BRAND } from '../../constants/brand';

export default function Hero() {
  const { t } = useTranslation();

  function scrollToServices() {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-navy via-[#1a3358] to-primary-blue">
      {/* Geometric background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/4 animate-spin-slow" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-blue/10 animate-float" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 rounded-full bg-gold/6 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 border border-white/4 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-cream to-transparent" />
      </div>

      <div className="relative z-10 text-center px-5 py-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-8"
        >
          <img
            src={BRAND.logo}
            alt={BRAND.name}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto ring-4 ring-gold/50 animate-pulse-glow"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/apply/inside"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-base transition-all hover:shadow-[0_0_24px_rgba(245,183,49,0.3)] active:scale-[0.97]"
          >
            {t('hero.cta_apply')}
          </Link>
          <button
            onClick={scrollToServices}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-base transition-all border border-white/20 hover:border-white/40"
          >
            {t('hero.cta_learn')}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
