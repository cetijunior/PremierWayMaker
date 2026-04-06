// api/src/controllers/paypal.controller.js
'use strict';

const { Application } = require('../models');
const paypalService = require('../services/paypal.service');
const emailService = require('../services/email.service');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/paypal/create-order
 * Called by the frontend PayPal SDK `createOrder` callback.
 * Expects { applicationId } in the body.
 * Returns { orderID } to the frontend.
 */
async function createOrder(req, res, next) {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      throw new ApiError(400, 'applicationId is required');
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    // Guard: don't create a new order if already paid
    if (application.paymentStatus === 'paid') {
      throw new ApiError(409, 'Application is already paid');
    }

    const order = await paypalService.createOrder({
      applicationId: application._id.toString(),
      type: application.type,
      fullName: application.fullName,
      email: application.email,
      amountEuros: application.amount,
    });

    res.json({ orderID: order.id });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/paypal/capture-order
 * Called by the frontend PayPal SDK `onApprove` callback.
 * Expects { orderID, applicationId } in the body.
 * Captures the payment, marks the application as paid, sends emails.
 */
async function captureOrder(req, res, next) {
  try {
    const { orderID, applicationId } = req.body;

    if (!orderID || !applicationId) {
      throw new ApiError(400, 'orderID and applicationId are required');
    }

    // Capture with PayPal first
    const capture = await paypalService.captureOrder(orderID);

    const captureStatus = capture.status; // COMPLETED, VOIDED, etc.

    if (captureStatus !== 'COMPLETED') {
      // Payment didn't go through — mark as failed and return error
      await Application.findByIdAndUpdate(applicationId, {
        paymentStatus: 'failed',
        paypalOrderId: orderID,
      });
      throw new ApiError(402, `Payment not completed. PayPal status: ${captureStatus}`);
    }

    // Mark as paid and store PayPal order ID
    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        paymentStatus: 'paid',
        paypalOrderId: orderID,
      },
      { new: true }
    );

    if (!application) {
      throw new ApiError(404, 'Application not found after capture');
    }

    // Send confirmation emails (non-blocking — don't fail the request if email fails)
    emailService
      .sendApplicationConfirmation({
        fullName: application.fullName,
        email: application.email,
        type: application.type,
        amount: application.amount,
        bookingStart: application.bookingStart,
        bookingEnd: application.bookingEnd,
      })
      .catch((err) => console.error('[email] applicant confirmation failed:', err.message));

    emailService
      .sendAdminNotification({
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        type: application.type,
        amount: application.amount,
        bookingStart: application.bookingStart,
        bookingEnd: application.bookingEnd,
        applicationId: application._id.toString(),
      })
      .catch((err) => console.error('[email] admin notification failed:', err.message));

    res.json({
      success: true,
      applicationId: application._id,
      fullName: application.fullName,
      type: application.type,
      amount: application.amount,
      paymentStatus: application.paymentStatus,
      bookingStart: application.bookingStart,
      bookingEnd: application.bookingEnd,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/paypal/webhook
 * Receives PayPal webhook events (e.g. PAYMENT.CAPTURE.COMPLETED).
 * Acts as a safety net in case the frontend capture call fails.
 */
async function handleWebhook(req, res) {
  try {
    const isValid = await paypalService.verifyWebhook({
      headers: req.headers,
      rawBody: req.rawBody,
      body: req.body,
    });

    if (!isValid) {
      console.warn('[paypal webhook] invalid signature');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const { event_type, resource } = req.body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const customId = resource.custom_id; // applicationId stored at order creation
      const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;

      if (customId) {
        const application = await Application.findById(customId);

        // Only update if not already marked paid (avoid double-processing)
        if (application && application.paymentStatus !== 'paid') {
          await Application.findByIdAndUpdate(customId, {
            paymentStatus: 'paid',
            ...(paypalOrderId && { paypalOrderId }),
          });

          emailService
            .sendApplicationConfirmation({
              fullName: application.fullName,
              email: application.email,
              type: application.type,
              amount: application.amount,
              bookingStart: application.bookingStart,
              bookingEnd: application.bookingEnd,
            })
            .catch((err) =>
              console.error('[email] webhook applicant confirmation failed:', err.message)
            );

          emailService
            .sendAdminNotification({
              fullName: application.fullName,
              email: application.email,
              phone: application.phone,
              type: application.type,
              amount: application.amount,
              bookingStart: application.bookingStart,
              bookingEnd: application.bookingEnd,
              applicationId: application._id.toString(),
            })
            .catch((err) =>
              console.error('[email] webhook admin notification failed:', err.message)
            );
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('[paypal webhook] error:', err.message);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

module.exports = { createOrder, captureOrder, handleWebhook };
