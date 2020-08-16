const products = [];

const getAddProduct = (req, res, next) => {
  res.render('ejs/add-product', {
    products,
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCss: true,
    formsCss: true,
  });
};

const postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });

  res.redirect('/');
};

const getProducts = (req, res, next) => {
  res.render('ejs/shop', {
    products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCss: true,
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};
