import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiWrenchScrewdriver } from 'react-icons/hi2';
import { MdRestaurant, MdComputer, MdLocalHospital } from 'react-icons/md';
import ServiceCard from './ServiceCard';

const SERVICE_KEYS = [
  { key: 'construction', Icon: HiWrenchScrewdriver },
  { key: 'hospitality', Icon: MdRestaurant },
  { key: 'tech', Icon: MdComputer },
  { key: 'healthcare', Icon: MdLocalHospital },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ServiceGrid() {
  const { t } = useTranslation();

  return (
    <section id="services" className="relative py-20 px-5 bg-cream overflow-hidden">
      {/* Soft floating shapes background, inspired by hero */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-10 w-56 h-56 rounded-full bg-blue/5 animate-float" />
        <div className="absolute top-1/3 -left-20 w-40 h-40 rounded-full bg-gold/5 animate-spin-slow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 border border-navy/5 rounded-full animate-spin-slow" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-3">
            {t('services.heading')}
          </h2>
          <p className="text-text-light max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {t('services.subtitle')}
          </p>
          <p className="mt-4 text-xs md:text-sm text-slate-500 max-w-3xl mx-auto italic leading-relaxed border-t border-slate-200 pt-4">
            {t('services.disclaimer')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICE_KEYS.map(({ key, Icon }) => (
            <motion.div key={key} variants={cardVariants}>
              <ServiceCard
                title={t(`services.${key}.title`)}
                desc={t(`services.${key}.desc`)}
                Icon={Icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
