const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function auth(req, _res, next) {
  const header = req.headers.authorization;
  const tokenFromQuery = req.query.token;
  const token = header ? header.split(' ')[1] : tokenFromQuery;

  if (!token) {
    return next(new ApiError(401, 'No token provided'));
  }

  try {
    req.admin = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch {
    next(new ApiError(401, 'Invalid token'));
  }
}

module.exports = auth;
