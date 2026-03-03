const { Router } = require('express');
const applyRoutes = require('./apply.routes');
const adminRoutes = require('./admin.routes');
const webhookRoutes = require('./webhook.routes');
const healthRoutes = require('./health.routes');

const router = Router();

router.use(healthRoutes);
router.use('/apply', applyRoutes);
router.use('/admin', adminRoutes);
router.use('/stripe/webhook', webhookRoutes);

module.exports = router;
