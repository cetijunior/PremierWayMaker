// api/src/routes/paypal.routes.js
'use strict';

const { Router } = require('express');
const express = require('express');
const paypalController = require('../controllers/paypal.controller');

const router = Router();

// Webhook needs raw body for signature verification — mount before JSON parser
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Attach rawBody string for verification
    req.rawBody = req.body.toString('utf8');
    // Parse body so the controller can read event fields
    try {
      req.body = JSON.parse(req.rawBody);
    } catch {
      req.body = {};
    }
    next();
  },
  paypalController.handleWebhook
);

// These two use normal JSON bodies (registered after app-level JSON parser)
router.post('/create-order', paypalController.createOrder);
router.post('/capture-order', paypalController.captureOrder);

module.exports = router;
