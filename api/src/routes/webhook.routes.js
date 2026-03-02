const { Router } = require('express');
const express = require('express');
const webhookController = require('../controllers/webhook.controller');

const router = Router();

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook
);

module.exports = router;
