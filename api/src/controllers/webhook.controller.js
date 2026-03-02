const { Application } = require('../models');
const stripeService = require('../services/stripe.service');
const emailService = require('../services/email.service');

async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripeService.constructWebhookEvent(req.body, sig);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const application = await Application.findOneAndUpdate(
      { stripeSessionId: session.id },
      { paymentStatus: 'paid' },
      { new: true }
    );

    if (application) {
      await emailService.sendPaymentConfirmation({
        fullName: application.fullName,
        email: application.email,
        type: application.type,
        amount: application.amount,
      });
    }
  }

  res.json({ received: true });
}

module.exports = { handleStripeWebhook };
