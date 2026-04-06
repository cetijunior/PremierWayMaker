// api/src/routes/index.js
'use strict';

const { Router } = require('express');
const applyRoutes   = require('./apply.routes');
const adminRoutes   = require('./admin.routes');
const paypalRoutes  = require('./paypal.routes');
const healthRoutes  = require('./health.routes');

const router = Router();

router.use(healthRoutes);
router.use('/apply',  applyRoutes);
router.use('/admin',  adminRoutes);
router.use('/paypal', paypalRoutes);

module.exports = router;
