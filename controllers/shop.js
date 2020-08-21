const Product = require('../models/product');
const Cart = require('../models/cart');

const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('ejs/shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

const getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findByPk(productId)
    .then((product) => {
      res.render('ejs/shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

const getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('ejs/shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

const getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];

      for (product of products) {
        const cartProduct = cart.products.find(
          (prod) => prod.id === product.id
        );

        if (cartProduct) {
          cartProducts.push({
            productData: product,
            quantity: cartProduct.quantity,
          });
        }
      }

      res.render('ejs/shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts,
      });
    });
  });
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId).then(([product]) => {
    Cart.addProduct(productId, product[0].price);
    res.redirect('/cart');
  });
};

const postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};

const getOrders = (req, res, next) => {
  res.render('ejs/shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

const getCheckout = (req, res, next) => {
  res.render('ejs/shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
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
};
