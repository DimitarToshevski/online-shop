const Product = require('../models/product');

const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('ejs/shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
        mongo: true,
      });
    })
    .catch((err) => console.log(err));
};

const getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      res.render('ejs/shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
        mongo: true,
      });
    })
    .catch((err) => console.log(err));
};

const getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('ejs/shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
        mongo: true,
      });
    })
    .catch((err) => console.log(err));
};

const getCart = (req, res, next) => {
  req.mongoUser
    .getCart()
    .then((products) => {
      res.render('ejs/shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products,
        mongo: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.mongoUser.addToCart(product);
    })
    .then(() => {
      res.redirect('/mongo/cart');
    });
};

const postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.mongoUser
    .deleteItemFromCartById(productId)
    .then(() => {
      res.redirect('/mongo/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

const postOrder = (req, res, next) => {
  req.mongoUser
    .addOrder()
    .then(() => {
      res.redirect('/mongo/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

const getOrders = (req, res, next) => {
  req.mongoUser
    .getOrders()
    .then((orders) => {
      res.render('ejs/shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders,
        mongo: true,
      });
    })
    .catch((err) => console.log(err));
};

const getCheckout = (req, res, next) => {
  res.render('ejs/shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    mongo: true,
  });
};

module.exports = {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  postOrder,
};
