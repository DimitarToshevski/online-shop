const Product = require('../models/product');
const Order = require('../models/order');
const mongoose = require('mongoose');

const getProducts = (req, res, next) => {
  Product.find()
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

  Product.findById(mongoose.Types.ObjectId(productId))
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
  Product.find()
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
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      res.render('ejs/shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: user.cart.items,
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
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: i.productId };
      });

      const order = new Order({
        user: {
          userId: req.mongoUser._id,
        },
        products,
      });

      return order.save();
    })
    .then(() => {
      return req.mongoUser.clearCart();
    })
    .then(() => {
      res.redirect('/mongo/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.mongoUser._id })
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
