const MongoProduct = require('../mongo-project/models/product');
const MySqlProduct = require('../models/product');

module.exports = {
  getMongoProducts(args, req) {
    return MongoProduct.find().catch((err) => console.log(err));
  },
  getMySqlProducts(args, req) {
    return MySqlProduct.findAll().catch((err) => console.log(err));
  },
};
