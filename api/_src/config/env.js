// api/src/config/env.js
'use strict';

const fs   = require('fs');
const path = require('path');

// Only load .env file if it exists and we're not in production (already in process.env)
const envPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(envPath) && process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: envPath });
} else {
  // Try to load any root .env as fallback if it exists
  require('dotenv').config();
}

const REQUIRED_IN_PRODUCTION = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'CLIENT_URL',
  'ADMIN_URL',
];

function validateEnv() {
  if (process.env.NODE_ENV !== 'production') return;
  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

const env = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',

  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:3001',

  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || '',
  PAYPAL_ENV: process.env.PAYPAL_ENV || 'sandbox',
  PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID || '',

  GMAIL_USER: process.env.GMAIL_USER || '',
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || '',

  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || '',
};

if (!env.MONGODB_URI?.trim()) {
  throw new Error('MONGODB_URI is required. Add it to your .env file.');
}

validateEnv();

module.exports = env;