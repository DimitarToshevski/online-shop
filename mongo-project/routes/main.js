const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const shopRoutes = require('./shop');

router.use('/admin', adminRoutes);
router.use(shopRoutes);
router.use(authRoutes);

module.exports = router;
