let products = [];

const postGetProducts = (req, res, next) => {
  products = req.body;
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

const stripQuery = (req, res, next) => {
  let query = req.body.query.toLowerCase().replace(' ', '').replace(',', ' ');

  if (query.indexOf('image') > -1) {
    query = query.replace('image', 'imageUrl');
  }

  const updatedQuery = { query: `{ getProducts { ${query} } }` };

  req.body = updatedQuery;

  next();
};

module.exports = {
  getProducts,
  stripQuery,
  postGetProducts,
  getIndex,
};
