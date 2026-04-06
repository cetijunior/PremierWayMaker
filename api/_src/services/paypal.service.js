// api/src/services/paypal.service.js
'use strict';

const env = require('../config/env');

const PAYPAL_BASE =
  env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const credentials = Buffer.from(
    `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed: ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function createOrder({ applicationId, type, fullName, amountEuros }) {
  const token = await getAccessToken();
  const typeLabel = type === 'inside' ? 'Inside Albania' : 'Outside Albania';

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: applicationId,
        custom_id: applicationId,
        description: `Application Fee - ${typeLabel} (${fullName})`,
        amount: {
          currency_code: 'USD',
          value: amountEuros.toFixed(2),
        },
      },
    ],
  };

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `pwm-${applicationId}-${Date.now()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `PayPal createOrder failed: ${res.status}`);
  }

  return res.json();
}

async function captureOrder(orderID) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('[PayPal capture full error]', JSON.stringify(err, null, 2));
    throw new Error(err.message || `PayPal captureOrder failed: ${res.status}`);
  }

  return res.json();
}

async function verifyWebhook({ headers, rawBody, body }) {
  if (!env.PAYPAL_WEBHOOK_ID) {
    console.warn('[paypal] PAYPAL_WEBHOOK_ID not set - skipping webhook verification');
    return true;
  }

  const token = await getAccessToken();

  const verifyBody = {
    auth_algo: headers['paypal-auth-algo'],
    cert_url: headers['paypal-cert-url'],
    transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
    webhook_id: env.PAYPAL_WEBHOOK_ID,
    webhook_event: body,
  };

  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verifyBody),
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.verification_status === 'SUCCESS';
}

module.exports = { createOrder, captureOrder, verifyWebhook };