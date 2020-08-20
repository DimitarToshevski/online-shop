const Product = require('../models/product');

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('ejs/admin/products', {
      products,
      pageTitle: 'Products',
      path: '/admin/products',
      // hasProducts: products.length > 0,
      // activeShop: true,
      // productCss: true,
    });
  });
};

const getAddProduct = (req, res, next) => {
  res.render('ejs/admin/add-product', {
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

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};
