let products = [];

const postGetProducts = (req, res, next) => {
  products = req.body;
  res.redirect('/graphql/products');
};

const getProducts = (req, res, next) => {
  res.render('ejs/shop/products-graphql', {
    products,
    pageTitle: 'GraphQL Products',
    path: '/graphql',
    mongo: false,
  });
};

const getIndex = (req, res, next) => {
  res.render('ejs/shop/graphql-form', {
    pageTitle: 'GraphQL Products',
    path: '/graphql',
    mongo: false,
  });
};

const stripQuery = (req, res, next) => {
  let query = req.body.query.toLowerCase().replace(' ', '').replace(',', ' ');

  if (query.indexOf('image') > -1) {
    query = query.replace('image', 'imageUrl');
  }

  const updatedQuery = {
    query: `{ ${
      req.body.isMongo ? 'getMongoProducts' : 'getMySqlProducts'
    } { ${query} } }`,
  };

  req.body = updatedQuery;

  next();
};

module.exports = {
  getProducts,
  stripQuery,
  postGetProducts,
  getIndex,
};
