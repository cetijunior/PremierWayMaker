const { Application } = require('../models');
const storageService = require('../services/storage.service');
const ApiError = require('../utils/ApiError');
const { isWithinBusinessHours } = require('../utils/businessHours');

async function submitApplication(req, res, next) {
  try {
    const { fullName, email, phone, type, bookingStart, bookingEnd } = req.body;

    // Temporary: bypass Stripe and derive amount locally.
    const amount = type === 'inside' ? 50 : 200;

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

    // Prevent overlapping bookings for non-failed applications.
    const overlapping = await Application.findOne({
      paymentStatus: { $in: ['pending', 'paid'] },
      bookingEnd: { $gt: parsedStart },
      bookingStart: { $lt: parsedEnd },
    }).lean();

    if (overlapping) {
      throw new ApiError(409, 'Selected time slot is no longer available. Please choose another time.');
    }

    // Derive a legacy date-only field for existing admin views, based on the start time.
    const bookingDate = new Date(parsedStart);
    bookingDate.setHours(0, 0, 0, 0);

    const cvPath = await storageService.saveCv(req.file.buffer, req.file.originalname);

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
      // Mark as paid so it appears fully processed in the admin dashboard.
      paymentStatus: 'paid',
    });

    // Temporary response while payment is bypassed.
    res.json({ success: true, applicationId: application._id });
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
      bookingStart: application.bookingStart,
      bookingEnd: application.bookingEnd,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitApplication, getApplicationStatus };
