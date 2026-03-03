const { Application } = require('../models');
const stripeService = require('../services/stripe.service');
const ApiError = require('../utils/ApiError');

async function submitApplication(req, res, next) {
  try {
    const { fullName, email, phone, type, bookingDate } = req.body;
    const amount = stripeService.getAmountInEuros(type);

    const application = await Application.create({
      fullName,
      email,
      phone,
      type,
      bookingDate: new Date(bookingDate),
      cvPath: req.file.filename,
      amount,
    });

    const session = await stripeService.createCheckoutSession({
      application,
      type,
      fullName,
      email,
    });

    application.stripeSessionId = session.id;
    await application.save();

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    next(err);
  }
}

async function getApplicationStatus(req, res, next) {
  try {
    const application = await Application.findOne({
      stripeSessionId: req.params.sessionId,
    });

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    res.json({
      fullName: application.fullName,
      type: application.type,
      amount: application.amount,
      paymentStatus: application.paymentStatus,
      bookingDate: application.bookingDate,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitApplication, getApplicationStatus };
