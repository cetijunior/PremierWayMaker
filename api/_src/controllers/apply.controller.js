// api/src/controllers/apply.controller.js
'use strict';

const { Application } = require('../models');
const storageService = require('../services/storage.service');
const ApiError = require('../utils/ApiError');
const { isWithinBusinessHours } = require('../utils/businessHours');

/**
 * POST /api/apply
 * Saves the application (paymentStatus: 'pending') and returns the applicationId.
 * The frontend then calls POST /api/paypal/create-order with that applicationId
 * to get a PayPal orderID, opens the PayPal modal, and on approval calls
 * POST /api/paypal/capture-order to finalise payment.
 */
async function submitApplication(req, res, next) {
  try {
    const { fullName, email, phone, type, bookingStart, bookingEnd } = req.body;

    const PRICES = { inside: 50, outside: 300 };
    const amount = PRICES[type];

    const parsedStart = new Date(bookingStart);
    const parsedEnd = new Date(bookingEnd);

    if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
      throw new ApiError(400, 'Invalid booking start or end time');
    }

    if (parsedStart >= parsedEnd) {
      throw new ApiError(400, 'Booking end time must be after start time');
    }

    const businessHoursCheck = isWithinBusinessHours(parsedStart, parsedEnd);
    if (!businessHoursCheck.ok) {
      throw new ApiError(
        400,
        businessHoursCheck.reason ||
          'Bookings are only available Monday–Friday between 08:00 and 18:00 (Tirana local time).'
      );
    }

    // Prevent overlapping bookings (pending or paid only — ignore failed)
    const overlapping = await Application.findOne({
      paymentStatus: { $in: ['pending', 'paid'] },
      bookingEnd: { $gt: parsedStart },
      bookingStart: { $lt: parsedEnd },
    }).lean();

    if (overlapping) {
      throw new ApiError(
        409,
        'Selected time slot is no longer available. Please choose another time.'
      );
    }

    const bookingDate = new Date(parsedStart);
    bookingDate.setHours(0, 0, 0, 0);

    const cvPath = await storageService.saveCv(req.file.buffer, req.file.originalname);

    // Save with paymentStatus: 'pending' — will be updated to 'paid' after PayPal capture
    const application = await Application.create({
      fullName,
      email,
      phone,
      type,
      bookingDate,
      bookingStart: parsedStart,
      bookingEnd: parsedEnd,
      cvPath,
      amount,
      paymentStatus: 'pending',
    });

    res.json({ applicationId: application._id });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/apply/status/:sessionId
 * Kept for backwards compatibility (Stripe success page flow).
 * Now also accepts a MongoDB applicationId directly.
 */
async function getApplicationStatus(req, res, next) {
  try {
    const { sessionId } = req.params;

    // Try by stripeSessionId first (legacy), then by _id (new PayPal flow)
    let application = await Application.findOne({ stripeSessionId: sessionId });

    if (!application) {
      // Might be a raw MongoDB _id (PayPal flow passes applicationId)
      try {
        application = await Application.findById(sessionId);
      } catch {
        // Not a valid ObjectId — fall through to 404
      }
    }

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    res.json({
      fullName: application.fullName,
      type: application.type,
      amount: application.amount,
      paymentStatus: application.paymentStatus,
      bookingDate: application.bookingDate,
      bookingStart: application.bookingStart,
      bookingEnd: application.bookingEnd,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitApplication, getApplicationStatus };
