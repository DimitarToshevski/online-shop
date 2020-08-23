const Product = require('../models/product');

const getProducts = (req, res, next) => {
  Product.find({ userId: req.mongoUser._id })
    // .select('title price -_id').populate('userId')
    .then((products) => {
      res.render('ejs/admin/products', {
        products,
        pageTitle: 'Products',
        path: '/admin/products',
        mongo: true,
      });
    })
    .catch((err) => console.log(err));
};

const getAddProduct = (req, res, next) => {
  res.render('ejs/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
    mongo: true,
  });
};

const postAddProduct = (req, res, next) => {
  const product = new Product({
    ...req.body,
    userId: req.mongoUser._id,
  });

  product
    .save()
    .then(() => {
      res.redirect('/mongo/admin/products');
    })
    .catch((err) => console.log(err));
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect('/mongo');
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect('/mongo');
      }

      res.render('ejs/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editMode,
        product,
        mongo: true,
      });
    })
    .catch((err) => console.log(err));
};

const postEditProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.mongoUser._id.toString()) {
        return res.redirect('/mongo');
      }

      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;

      return product.save().then(() => {
        res.redirect('/mongo/admin/products');
      });
    })
    .catch((err) => console.log(err));
};

const postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.deleteOne({ _id: productId, userId: req.mongoUser._id })
    .then(() => {
      res.redirect('/mongo/admin/products');
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
