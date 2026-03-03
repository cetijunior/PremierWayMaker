const stripe = require('../config/stripe');
const env = require('../config/env');
const { PRICES_CENTS } = require('../constants/pricing');

async function createCheckoutSession({ application, type, fullName, email }) {
  const amount = PRICES_CENTS[type];

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
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
    return_url: `${env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: email,
    metadata: { applicationId: application._id.toString() },
  });

  return session;
}

function constructWebhookEvent(body, signature) {
  return stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
}

function getAmountInEuros(type) {
  return PRICES_CENTS[type] / 100;
}

module.exports = {
  createCheckoutSession,
  constructWebhookEvent,
  getAmountInEuros,
};
