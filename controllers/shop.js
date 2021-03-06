const Product = require('../models/product');

const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('ejs/shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
        mongo: false,
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
        mongo: false,
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
        mongo: false,
      });
    })
    .catch((err) => console.log(err));
};

const getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render('ejs/shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products,
        mongo: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;

      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      if (products.length > 0) {
        const product = products[0];
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      } else {
        return Product.findByPk(productId);
      }
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

const postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];

      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

const postOrder = (req, res, next) => {
  let fetchedCart;
  let fetchedProducts;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;

      return cart.getProducts();
    })
    .then((products) => {
      fetchedProducts = products;

      return req.user.createOrder();
    })
    .then((order) => {
      return order.addProducts(
        fetchedProducts.map((p) => {
          p.orderItem = { quantity: p.cartItem.quantity };

          return p;
        })
      );
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

const getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('ejs/shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders,
        mongo: false,
      });
    })
    .catch((err) => console.log(err));
};

const getCheckout = (req, res, next) => {
  res.render('ejs/shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    mongo: false,
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
