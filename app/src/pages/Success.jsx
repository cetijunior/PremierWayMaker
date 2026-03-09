import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi2';
import { getApplicationStatus } from '../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Success() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Non-Stripe flow: data will be provided via navigation state.
    if (!sessionId && location.state && location.state.fullName) {
      const { fullName, type } = location.state;
      const amount = type === 'inside' ? 50 : 200;

      setData({
        fullName,
        type,
        amount,
        paymentStatus: 'paid',
        bookingDate: null,
        bookingStart: null,
        bookingEnd: null,
      });
      setLoading(false);
      return;
    }

    if (!sessionId) {
      setLoading(false);
      return;
    }
    getApplicationStatus(sessionId)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-cream">
        <div className="text-center text-text-light">{t('success.loading')}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-5 bg-cream">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy mb-2">{t('success.error_title')}</h1>
          <p className="text-text-light mb-5">{t('success.error_message')}</p>
          <Link to="/">
            <Button variant="secondary">{t('apply_page.go_home')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const typeName = data.type === 'inside' ? t('success.inside') : t('success.outside');

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-5 bg-cream">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-green-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
        >
          <HiCheck className="w-10 h-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-extrabold text-navy mb-3">{t('success.title')}</h1>
          <p className="text-text-light mb-2">
            <Trans
              i18nKey="success.thank_you"
              values={{ name: data.fullName, type: typeName }}
              components={{ strong: <strong className="text-navy" /> }}
            />
          </p>
          <p className="text-text-light mb-5">
            <Trans
              i18nKey="success.payment_success"
              values={{ amount: data.amount }}
              components={{ strong: <strong className="text-navy" /> }}
            />
          </p>
          <p className="mb-4 text-sm">
            {t('success.payment_status')}{' '}
            <Badge status={data.paymentStatus} />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white inline-block px-10 py-6 rounded-2xl shadow-sm border border-gray-100 mb-6"
        >
          <p className="text-sm text-text-light">
            <strong className="text-navy">{t('success.amount')}</strong> &euro;{data.amount}
          </p>
          <p className="text-sm text-text-light mt-1">
            <strong className="text-navy">{t('success.type')}</strong> {typeName}
          </p>
          {(data.bookingDate || data.bookingStart) && (
            <p className="text-sm text-text-light mt-1">
              <strong className="text-navy">{t('success.booking_date')}</strong>{' '}
              {new Date(data.bookingStart || data.bookingDate).toLocaleString()}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-text-light text-sm mb-6 leading-relaxed">
            {t('success.receipt_note')}
          </p>
          <Link to="/">
            <Button variant="secondary">{t('success.back')}</Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
