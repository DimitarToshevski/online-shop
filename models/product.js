const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const pathToFile = path.join(rootDir, 'data', 'products.json');

module.exports = class Product {
  title;

  constructor(rawObject) {
    if (rawObject) {
      this.title = rawObject.title;
    }
  }

  save() {
    fs.readFile(pathToFile, (err, fileContent) => {
      let products = [];

      if (!err) {
        products = JSON.parse(fileContent);
      }

      products.push(this);

      fs.writeFile(pathToFile, JSON.stringify(products), (err) => {
        console.error(err);
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(pathToFile, (err, fileContent) => {
      if (err) {
        callback([]);
      }

      callback(JSON.parse(fileContent));
    });
  }
};
