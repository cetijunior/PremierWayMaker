const env = require('../config/env');
const stripeService = require('./stripe.service');
const paypalService = require('./paypal.service');
const ApiError = require('../utils/ApiError');

async function initializePayment({ application }) {
    const provider = env.PAYMENT_PROVIDER;

    if (provider === 'paypal') {
        try {
            const paypalOrder = await paypalService.createOrder({ application });
            return {
                provider: 'paypal',
                referenceId: paypalOrder.orderId,
                checkout: {
                    orderId: paypalOrder.orderId,
                    approvalUrl: paypalOrder.approvalUrl,
                },
            };
        } catch (err) {
            if (!env.ENABLE_STRIPE_FALLBACK) {
                throw err;
            }
        }
    }

    if (provider === 'stripe' || env.ENABLE_STRIPE_FALLBACK) {
        const session = await stripeService.createCheckoutSession({
            application,
            type: application.type,
            fullName: application.fullName,
            email: application.email,
        });

        return {
            provider: 'stripe',
            referenceId: session.id,
            checkout: {
                sessionId: session.id,
                clientSecret: session.client_secret,
            },
        };
    }

    throw new ApiError(500, 'Unable to initialize payment provider');
}

module.exports = {
    initializePayment,
};
