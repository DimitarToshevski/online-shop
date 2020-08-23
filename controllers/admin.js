const Product = require('../models/product');

const getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render('ejs/admin/products', {
        products,
        pageTitle: 'Products',
        path: '/admin/products',
        mongo: false,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

const getAddProduct = (req, res, next) => {
  res.render('ejs/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
    mongo: false,
    isLoggedIn: req.session.isLoggedIn,
  });
};

const postAddProduct = (req, res, next) => {
  req.user
    .createProduct(req.body)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect('/');
  }

  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];

      if (!product) {
        return res.redirect('/');
      }

      res.render('ejs/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editMode,
        product,
        mongo: false,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

const postEditProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then((product) => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;

      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

const postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
