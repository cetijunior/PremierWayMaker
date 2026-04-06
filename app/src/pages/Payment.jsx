// app/src/pages/Payment.jsx
import { useState } from 'react';
import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiLockClosed } from 'react-icons/hi2';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
// console.log('PayPal Client ID:', import.meta.env.VITE_PAYPAL_CLIENT_ID);

export default function Payment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { applicationId, type, fullName, amount } = location.state || {};

  const [errorMsg, setErrorMsg] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!applicationId) {
    return <Navigate to="/" replace />;
  }

  async function createOrder() {
    setErrorMsg('');
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not create PayPal order');
    return data.orderID;
  }

  async function onApprove(data) {
    setProcessing(true);
    try {
      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: data.orderID,
          applicationId,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Capture failed');

      navigate('/success', {
        state: {
          fullName: result.fullName || fullName,
          type: result.type || type,
          amount: result.amount || amount,
          bookingStart: result.bookingStart,
          bookingEnd: result.bookingEnd,
          paymentStatus: 'paid',
        },
        replace: true,
      });
    } catch (err) {
      setErrorMsg(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  }

  function onError(err) {
    console.error('[PayPal]', err);
    setErrorMsg('Something went wrong with PayPal. Please try again.');
    setProcessing(false);
  }

  function onCancel() {
    setErrorMsg('Payment cancelled. You can try again below.');
    setProcessing(false);
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
          <p className="text-text-light text-sm mb-1">
            {t('payment.subtitle')}
          </p>
          {amount && (
            <p className="text-3xl font-bold text-blue mt-3">€{amount}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm mb-6">
              {errorMsg}
            </div>
          )}

          {processing ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-light text-sm">Confirming your payment…</p>
            </div>
          ) : (
            <PayPalScriptProvider
              options={{
                clientId: PAYPAL_CLIENT_ID,
                currency: 'USD',
                intent: 'capture',
              }}
            >
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'gold',
                  shape: 'rect',
                  label: 'pay',
                  height: 48,
                }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                onCancel={onCancel}
              />
            </PayPalScriptProvider>
          )}

          {!processing && (
            <p className="text-xs text-text-light text-center mt-4">
              Secured by PayPal. We never store your card details.
            </p>
          )}
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
