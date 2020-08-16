const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  res.render('ejs/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCss: true,
    formsCss: true,
  });
};

const postAddProduct = (req, res, next) => {
  const product = new Product(req.body);

  product.save();

  res.redirect('/');
};

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('ejs/shop', {
      products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCss: true,
    });
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};
