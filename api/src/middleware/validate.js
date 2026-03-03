const ApiError = require('../utils/ApiError');

function validateApplyBody(req, _res, next) {
  const { fullName, email, phone, type, bookingDate } = req.body;

  if (!fullName || !email || !phone || !type || !bookingDate) {
    return next(new ApiError(400, 'All fields are required'));
  }
  if (!['inside', 'outside'].includes(type)) {
    return next(new ApiError(400, 'Invalid application type'));
  }
  const parsed = new Date(bookingDate);
  if (isNaN(parsed.getTime())) {
    return next(new ApiError(400, 'Invalid booking date'));
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed < today) {
    return next(new ApiError(400, 'Booking date must be in the future'));
  }
  if (!req.file) {
    return next(new ApiError(400, 'CV file is required'));
  }

  next();
}

module.exports = { validateApplyBody };
