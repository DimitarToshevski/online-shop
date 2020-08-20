const Product = require('../models/product');

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('ejs/shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: '/products',
      // hasProducts: products.length > 0,
      // activeShop: true,
      // productCss: true,
    });
  });
};

const getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('ejs/shop/index', {
      products,
      pageTitle: 'Shop',
      path: '/',
      // hasProducts: products.length > 0,
      // activeShop: true,
      // productCss: true,
    });
  });
};

const getCart = (req, res, next) => {
  res.render('ejs/shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
    // hasProducts: products.length > 0,
    // activeShop: true,
    // productCss: true,
  });
};

const getOrders = (req, res, next) => {
  res.render('ejs/shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
    // hasProducts: products.length > 0,
    // activeShop: true,
    // productCss: true,
  });
};

const getCheckout = (req, res, next) => {
  res.render('ejs/shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    // hasProducts: products.length > 0,
    // activeShop: true,
    // productCss: true,
  });
};

module.exports = {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
};
