const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const pathToFile = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
  fs.readFile(pathToFile, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  id;
  title;
  imageUrl;
  description;
  price;

  constructor(rawObject) {
    if (rawObject) {
      this.id = rawObject.id;
      this.title = rawObject.title;
      this.imageUrl = rawObject.imageUrl;
      this.description = rawObject.description;
      this.price = rawObject.price;
    }
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProducts = [...products];

        updatedProducts[existingProductIndex] = this;

        fs.writeFile(pathToFile, JSON.stringify(updatedProducts), (err) => {
          console.error(err);
        });
      } else {
        this.id = Math.random().toString();

        products.push(this);

        fs.writeFile(pathToFile, JSON.stringify(products), (err) => {
          console.error(err);
        });
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(productId, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === productId);

      callback(product);
    });
  }
};
