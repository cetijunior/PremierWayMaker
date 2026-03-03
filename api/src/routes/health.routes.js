const { Router } = require('express');
const mongoose = require('mongoose');

const router = Router();

router.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const connected = dbState === 1;

  if (connected) {
    res.status(200).json({ status: 'ok', db: 'connected' });
  } else {
    res.status(503).json({ status: 'unhealthy', db: 'disconnected' });
  }
});

module.exports = router;
