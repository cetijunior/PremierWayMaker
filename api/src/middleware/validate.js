const ApiError = require('../utils/ApiError');

function validateApplyBody(req, _res, next) {
  const { fullName, email, phone, type } = req.body;

  if (!fullName || !email || !phone || !type) {
    return next(new ApiError(400, 'All fields are required'));
  }
  if (!['inside', 'outside'].includes(type)) {
    return next(new ApiError(400, 'Invalid application type'));
  }
  if (!req.file) {
    return next(new ApiError(400, 'CV file is required'));
  }

  next();
}

module.exports = { validateApplyBody };
