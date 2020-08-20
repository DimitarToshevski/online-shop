const Product = require('../models/product');

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('ejs/admin/products', {
      products,
      pageTitle: 'Products',
      path: '/admin/products',
    });
  });
};

const getAddProduct = (req, res, next) => {
  res.render('ejs/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
  });
};

const postAddProduct = (req, res, next) => {
  const product = new Product(req.body);

  product.save();

  res.redirect('/');
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect('/');
    }

    res.render('ejs/admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editMode,
      product,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const productId = req.body.productId;

  const updatedProduct = new Product({ ...req.body, id: productId });

  updatedProduct.save();
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
};
