import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiMapPin, HiGlobeAlt } from 'react-icons/hi2';

const TIERS = [
  { key: 'inside', route: 'inside', Icon: HiMapPin },
  { key: 'outside', route: 'outside', Icon: HiGlobeAlt },
];

export default function ApplySection() {
  const { t } = useTranslation();

  return (
    <section id="apply" className="relative py-20 px-5 bg-cream-dark overflow-hidden">
      {/* Decorative background echoes hero styling */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 w-48 h-48 rounded-full bg-gold/5 animate-float" />
        <div className="absolute bottom-0 -right-24 w-64 h-64 rounded-full bg-navy/5 animate-spin-slow" />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 border border-white/5 rounded-full animate-spin-slow" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-3">
            {t('apply_section.heading')}
          </h2>
          <p className="text-text-light text-base md:text-lg">
            {t('apply_section.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TIERS.map(({ key, route, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="relative bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg hover:shadow-navy/5 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-gold via-gold-light to-gold" />

                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-navy to-blue flex items-center justify-center mx-auto mb-5 group-hover:from-gold group-hover:to-gold-light transition-all duration-300">
                  <Icon className="w-7 h-7 text-white group-hover:text-navy transition-colors duration-300" />
                </div>

                <h3 className="text-xl font-bold text-navy mb-1">
                  {t(`apply_section.${key}.label`)}
                </h3>
                <p className="text-sm text-text-light mb-1">
                  ({t(`apply_section.${key}.subtitle`)})
                </p>
                <p className="text-text-light mb-5 text-sm leading-relaxed">
                  {t(`apply_section.${key}.desc`)}
                </p>

                <motion.div
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  viewport={{ once: true }}
                  className="text-4xl font-extrabold text-blue mb-6"
                >
                  {t(`apply_section.${key}.price`)}
                </motion.div>

                <Link to={`/apply/${route}`}>
                  <button className="w-full px-6 py-3.5 bg-linear-to-r from-gold to-gold-light text-navy font-bold rounded-xl text-base transition-all hover:shadow-[0_0_20px_rgba(245,183,49,0.3)] active:scale-[0.97]">
                    {t('apply_section.cta', { price: t(`apply_section.${key}.price`) })}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
