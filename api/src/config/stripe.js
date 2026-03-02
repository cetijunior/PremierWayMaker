const Stripe = require('stripe');
const env = require('./env');

const stripe = Stripe(env.STRIPE_SECRET_KEY);

module.exports = stripe;
