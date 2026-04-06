// api/src/models/Application.model.js
'use strict';

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullName:      { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, required: true },
  type:          { type: String, enum: ['inside', 'outside'], required: true },
  cvPath:        { type: String, required: true },

  // Legacy date-only field kept for backwards compatibility in admin views.
  bookingDate:   { type: Date },
  bookingStart:  { type: Date, required: true },
  bookingEnd:    { type: Date, required: true },

  amount:        { type: Number, required: true },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },

  // Payment provider references (only one will be set per application)
  stripeSessionId: { type: String },   // legacy — kept for existing data
  paypalOrderId:   { type: String },   // new

  createdAt: { type: Date, default: Date.now },
});

applicationSchema.index({ bookingStart: 1, bookingEnd: 1 });

module.exports = mongoose.model('Application', applicationSchema);
