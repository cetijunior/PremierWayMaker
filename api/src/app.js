const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const env = require('./config/env');
const ApiError = require('./utils/ApiError');

function parseAllowedOrigins() {
  function normalizeToOrigin(value) {
    if (!value) return null;
    const trimmed = String(value).trim();
    if (!trimmed) return null;

    try {
      return new URL(trimmed).origin;
    } catch {
      // fallback: strip trailing slashes only (e.g. already an origin)
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

  // Webhook must be registered before JSON body parser (needs raw body)
  const webhookRoutes = require('./routes/webhook.routes');
  app.use('/api/stripe/webhook', webhookRoutes);

  const allowedOrigins = parseAllowedOrigins();
  app.use(
    cors({
      origin(origin, cb) {
        // allow server-to-server/no-origin requests
        if (!origin) return cb(null, true);
        const normalized = origin.replace(/\/+$/, '');
        if (allowedOrigins.has(normalized)) return cb(null, true);
        return cb(new ApiError(403, `CORS blocked for origin: ${origin}`));
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    })
  );
  app.use(express.json());

  app.use('/api', routes);

  if (env.NODE_ENV === 'production') {
    const appDist = path.resolve(__dirname, '../../app/dist');
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
