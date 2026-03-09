const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['inside', 'outside'], required: true },
  cvPath: { type: String, required: true },
  // Legacy date-only field kept for backwards compatibility in admin views.
  // New bookings should use bookingStart/bookingEnd for time-based scheduling.
  bookingDate: { type: Date },
  bookingStart: { type: Date, required: true },
  bookingEnd: { type: Date, required: true },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  stripeSessionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Helpful index for searching by start time, e.g. overlap checks and admin lists.
applicationSchema.index({ bookingStart: 1, bookingEnd: 1 });

module.exports = mongoose.model('Application', applicationSchema);
