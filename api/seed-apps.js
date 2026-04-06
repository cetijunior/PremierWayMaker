// api/seed-apps.js
const mongoose = require('mongoose');
const env = require('./src/config/env');
const { Application } = require('./src/models');

const sampleApplications = [
  {
    fullName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+355691234567',
    type: 'inside',
    cvPath: 'placeholder_cv_1.pdf',
    bookingStart: new Date(Date.now() + 86400000), // Tomorrow
    bookingEnd: new Date(Date.now() + 86400000 + 3600000), // Tomorrow + 1h
    amount: 50,
    paymentStatus: 'paid',
    paypalOrderId: 'PAYPAL_ID_123',
    createdAt: new Date(Date.now() - 1000000)
  },
  {
    fullName: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '+355692345678',
    type: 'outside',
    cvPath: 'placeholder_cv_2.pdf',
    bookingStart: new Date(Date.now() + 172800000), // Day after tomorrow
    bookingEnd: new Date(Date.now() + 172800000 + 3600000),
    amount: 300,
    paymentStatus: 'pending',
    paypalOrderId: 'PAYPAL_ID_456',
    createdAt: new Date(Date.now() - 500000)
  },
  {
    fullName: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '+355693456789',
    type: 'inside',
    cvPath: 'placeholder_cv_3.pdf',
    bookingStart: new Date(Date.now() + 432000000), // 5 days from now
    bookingEnd: new Date(Date.now() + 432000000 + 3600000),
    amount: 50,
    paymentStatus: 'failed',
    paypalOrderId: 'PAYPAL_ID_789',
    createdAt: new Date(Date.now() - 2000000)
  },
  {
    fullName: 'Diana Prince',
    email: 'diana.prince@example.com',
    phone: '+355694567890',
    type: 'outside',
    cvPath: 'placeholder_cv_4.pdf',
    bookingStart: new Date(Date.now() + 259200000), // 3 days from now
    bookingEnd: new Date(Date.now() + 259200000 + 3600000),
    amount: 300,
    paymentStatus: 'paid',
    stripeSessionId: 'STRIPE_SESSION_123', // Legacy
    createdAt: new Date(Date.now() - 86400000)
  }
];

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Application.deleteMany({});
    console.log('Cleared existing applications');
    await Application.insertMany(sampleApplications);
    console.log('Inserted placeholder applications');
  } catch (error) {
    console.error('Error seeding applications:', error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
