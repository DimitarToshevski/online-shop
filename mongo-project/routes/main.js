const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');

const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const graphqlRoutes = require('./graphql');
const shopRoutes = require('./shop');

router.use('/admin', isAuth, adminRoutes);
router.use('/graphql', isAuth, graphqlRoutes);
router.use(shopRoutes);
router.use(authRoutes);

module.exports = router;
