import { useLocation, Navigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiLockClosed } from 'react-icons/hi2';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Payment() {
  const { t } = useTranslation();
  const location = useLocation();
  const { clientSecret, type } = location.state || {};

  if (!clientSecret) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-5">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-navy to-blue flex items-center justify-center mx-auto mb-4">
            <HiLockClosed className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy mb-1">
            {t('payment.title')}
          </h2>
          <p className="text-text-light text-sm">
            {t('payment.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout className="min-h-[400px]" />
          </EmbeddedCheckoutProvider>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link
            to={type ? `/apply/${type}` : '/'}
            className="inline-flex items-center gap-2 text-blue hover:text-navy text-sm font-medium transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            {t('payment.back')}
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
