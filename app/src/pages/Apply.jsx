import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiMapPin, HiGlobeAlt } from 'react-icons/hi2';
import { APPLICATION_TYPES } from '../constants/services';
import { useApplicationForm } from '../hooks/useApplicationForm';
import ApplicationForm from '../components/apply/ApplicationForm';
import Button from '../components/ui/Button';

const ICONS = { inside: HiMapPin, outside: HiGlobeAlt };

export default function Apply() {
  const { t } = useTranslation();
  const { type } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);
  const config = APPLICATION_TYPES[type];
  const {
    form,
    error,
    loading,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useApplicationForm(type);

  const Icon = ICONS[type] || HiMapPin;

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 pt-16 bg-cream">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">
            {t('apply_page.invalid')}
          </h2>
          <Link to="/">
            <Button variant="secondary">{t('apply_page.go_home')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-cream pt-24 pb-16 px-5 overflow-hidden">
      {/* Soft background shapes to match hero aesthetic */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 right-0 w-72 h-72 rounded-full bg-blue/5 animate-float" />
        <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-gold/5 animate-spin-slow" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 border border-navy/5 rounded-full animate-spin-slow" />
      </div>

      <div className="relative max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-navy to-blue flex items-center justify-center mx-auto mb-4">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy mb-1">
            {t('apply_page.title', { type: config.label })}
          </h2>
          <p className="text-xl font-bold text-blue">
            {t('apply_page.fee', { price: config.price })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <ApplicationForm
            form={form}
            error={error}
            loading={loading}
            priceLabel={config.price}
            onFieldChange={handleChange}
            onFileSelect={handleFileChange}
            onSubmit={handleSubmit}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue hover:text-navy text-sm font-medium transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            {t('apply_page.back')}
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
