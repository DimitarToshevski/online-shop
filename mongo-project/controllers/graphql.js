let products = [];

const postGetProducts = (req, res, next) => {
  products = req.body;
  res.redirect('/mongo/graphql/products');
};

const getProducts = (req, res, next) => {
  res.render('ejs/shop/products-graphql', {
    products,
    pageTitle: 'GraphQL Products',
    path: '/graphql',
    mongo: true,
  });
};

const getIndex = (req, res, next) => {
  res.render('ejs/shop/graphql-form', {
    pageTitle: 'GraphQL Products',
    path: '/graphql',
    mongo: true,
  });
};

module.exports = {
  getProducts,
  postGetProducts,
  getIndex,
};
