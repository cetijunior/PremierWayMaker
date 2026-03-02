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
    <div className="min-h-screen bg-cream pt-24 pb-16 px-5">
      <div className="max-w-lg mx-auto">
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
