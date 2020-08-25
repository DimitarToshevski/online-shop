const express = require('express');
const router = express.Router();

const graphqlController = require('../controllers/graphql');

router.get('/', graphqlController.getIndex);
router.get('/products', graphqlController.getProducts);
router.post('/products', graphqlController.postGetProducts);

module.exports = router;
