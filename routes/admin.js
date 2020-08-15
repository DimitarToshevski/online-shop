const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
  res.render('ejs/add-product', {
    products,
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCss: true,
    formsCss: true,
  });
});

router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });

  res.redirect('/');
});

module.exports = { routes: router, products };
