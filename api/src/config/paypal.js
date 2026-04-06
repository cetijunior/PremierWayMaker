const env = require('./env');

const paypalConfig = {
    clientId: env.PAYPAL_CLIENT_ID,
    clientSecret: env.PAYPAL_CLIENT_SECRET,
    apiBase: env.PAYPAL_API_BASE,
};

module.exports = paypalConfig;
