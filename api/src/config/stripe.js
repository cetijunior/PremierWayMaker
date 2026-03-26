const Stripe = require('stripe');
const env = require('./env');

const stripe = env.STRIPE_SECRET_KEY ? Stripe(env.STRIPE_SECRET_KEY) : null;

if (!stripe) {
  console.warn('STRIPE_SECRET_KEY not set. Stripe functionality will be disabled.');
}

module.exports = stripe;
