const Product = require('../mongo-project/models/product');

module.exports = {
  getProducts(args, req) {
    return Product.find().catch((err) => console.log(err));
  },
};
