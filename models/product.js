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
  title;
  imageUrl;
  description;
  price;

  constructor(rawObject) {
    if (rawObject) {
      this.title = rawObject.title;
      this.imageUrl = rawObject.imageUrl;
      this.description = rawObject.description;
      this.price = rawObject.price;
    }
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);

      fs.writeFile(pathToFile, JSON.stringify(products), (err) => {
        console.error(err);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};
