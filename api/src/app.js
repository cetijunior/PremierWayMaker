// api/src/app.js
'use strict';

const express     = require('express');
const cors        = require('cors');
const path        = require('path');
const routes      = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const env         = require('./config/env');
const ApiError    = require('./utils/ApiError');

function parseAllowedOrigins() {
  function normalizeToOrigin(value) {
    if (!value) return null;
    const trimmed = String(value).trim();
    if (!trimmed) return null;
    try {
      return new URL(trimmed).origin;
    } catch {
      return trimmed.replace(/\/+$/, '');
    }
  }

  return new Set(
    [
      env.CLIENT_URL,
      env.ADMIN_URL,
      'http://localhost:3000',
      'http://localhost:3001',
    ]
      .map(normalizeToOrigin)
      .filter(Boolean)
  );
}

function createApp() {
  const app = express();

  const allowedOrigins = parseAllowedOrigins();
  
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true); // server-to-server / same-origin
        const normalized = origin.replace(/\/+$/, '');
        if (allowedOrigins.has(normalized)) return cb(null, true);
        return cb(new ApiError(403, `CORS blocked for origin: ${origin}`));
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    })
  );

  // NOTE: The PayPal webhook route mounts its OWN express.raw() middleware
  // internally (in paypal.routes.js) so it can read the raw body for
  // signature verification. The global JSON parser below runs AFTER that
  // route matches, so ordering here is fine — the webhook route is registered
  // under /api/paypal/webhook which is hit before express.json() processes it.
  app.use(express.json());

  app.use('/api', routes);

  if (env.NODE_ENV === 'production') {
    const appDist   = path.resolve(__dirname, '../../app/dist');
    const adminDist = path.resolve(__dirname, '../../admin/dist');

    app.use('/admin', express.static(adminDist));
    app.get('/admin/*', (_req, res) => {
      res.sendFile(path.join(adminDist, 'index.html'));
    });

    app.use(express.static(appDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(appDist, 'index.html'));
    });
  }

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
