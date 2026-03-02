const stripe = require('../config/stripe');
const env = require('../config/env');

const PRICES = { inside: 5000, outside: 20000 };

async function createCheckoutSession({ application, type, fullName, email }) {
  const amount = PRICES[type];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Application Fee - ${type === 'inside' ? 'Inside Albania' : 'Outside Albania'}`,
            description: `Application by ${fullName}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.CLIENT_URL}/apply/${type}`,
    customer_email: email,
    metadata: { applicationId: application._id.toString() },
  });

  return session;
}

function constructWebhookEvent(body, signature) {
  return stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
}

function getAmountInEuros(type) {
  return PRICES[type] / 100;
}

module.exports = {
  createCheckoutSession,
  constructWebhookEvent,
  getAmountInEuros,
  PRICES,
};
