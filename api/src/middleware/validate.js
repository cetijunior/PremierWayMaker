const ApiError = require('../utils/ApiError');
const { isWithinBusinessHours } = require('../utils/businessHours');

function validateApplyBody(req, _res, next) {
  const { fullName, email, phone, type, bookingStart, bookingEnd } = req.body;

  if (!fullName || !email || !phone || !type || !bookingStart || !bookingEnd) {
    return next(new ApiError(400, 'All fields are required'));
  }
  if (!['inside', 'outside'].includes(type)) {
    return next(new ApiError(400, 'Invalid application type'));
  }

  const parsedStart = new Date(bookingStart);
  const parsedEnd = new Date(bookingEnd);

  if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
    return next(new ApiError(400, 'Invalid booking start or end time'));
  }

  if (parsedStart >= parsedEnd) {
    return next(new ApiError(400, 'Booking end time must be after start time'));
  }

  const businessHoursCheck = isWithinBusinessHours(parsedStart, parsedEnd);
  if (!businessHoursCheck.ok) {
    return next(
      new ApiError(
        400,
        businessHoursCheck.reason ||
          'Bookings are only available Monday–Friday between 08:00 and 18:00 (Tirana local time).'
      )
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDay = new Date(parsedStart);
  startDay.setHours(0, 0, 0, 0);

  if (startDay < today) {
    return next(new ApiError(400, 'Booking date must be in the future'));
  }
  if (!req.file) {
    return next(new ApiError(400, 'CV file is required'));
  }

  next();
}

module.exports = { validateApplyBody };
