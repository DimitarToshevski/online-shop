const mongodb = require('mongodb');
const { getMongoDb } = require('../../util/nosql-database');

class User {
  _id;
  name;
  email;
  cart;

  constructor(rawObject) {
    if (rawObject) {
      this.name = rawObject.title;
      this.email = rawObject.price;
      this.cart = rawObject.cart;
      this._id = rawObject._id;
    }
  }

  save() {
    const db = getMongoDb().collection('users');

    return db.insertOne(this).catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (p) => p.productId.toString() === product._id.toString()
    );

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    return getMongoDb()
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(id) {
    return getMongoDb()
      .collection('users')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .catch((err) => console.log(err));
  }
}

module.exports = User;
