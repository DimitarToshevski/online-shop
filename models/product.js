const products = [];

module.exports = class Product {
  title;

  constructor(rawObject) {
    if (rawObject) {
      this.title = rawObject.title;
    }
  }

  save() {
    products.push(this);
  }

  static fetchAll() {
    return products;
  }
};
