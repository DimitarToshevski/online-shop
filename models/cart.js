const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const pathToFile = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  id;
  products;
  totalPrice;

  static addProduct(id, productPrice) {
    fs.readFile(pathToFile, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;

      if (existingProduct) {
        updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(pathToFile, JSON.stringify(cart), (err) => {
        console.error(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(pathToFile, (err, fileContent) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((p) => p.id === id);

      if (product) {
        const productQuantity = product.quantity;

        updatedCart.products = updatedCart.products.filter((p) => p.id !== id);

        updatedCart.totalPrice =
          updatedCart.totalPrice - productPrice * productQuantity;

        fs.writeFile(pathToFile, JSON.stringify(updatedCart), (err) => {
          console.error(err);
        });
      }
    });
  }

  static getCart(callback) {
    fs.readFile(pathToFile, (err, fileContent) => {
      if (err) {
        callback(null);
      } else {
        const cart = JSON.parse(fileContent);

        callback(cart);
      }
    });
  }
};
