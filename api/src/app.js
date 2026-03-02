const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const env = require('./config/env');

function createApp() {
  const app = express();

  // Webhook must be registered before JSON body parser (needs raw body)
  const webhookRoutes = require('./routes/webhook.routes');
  app.use('/api/stripe/webhook', webhookRoutes);

  app.use(cors());
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
