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

  getCart() {
    return getMongoDb()
      .collection('products')
      .find({ _id: { $in: this.cart.items.map((i) => i.productId) } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find(
              (i) => i.productId.toString() === p._id.toString()
            ).quantity,
          };
        });
      });
  }

  deleteItemFromCartById(id) {
    const updatedCartItems = this.cart.items.filter(
      (i) => i.productId.toString() !== id.toString()
    );

    return getMongoDb()
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    return this.getCart()
      .then((products) => {
        const order = {
          products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name,
          },
        };

        return getMongoDb().collection('orders').insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };

        return getMongoDb()
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    return getMongoDb()
      .collection('orders')
      .find({ 'user._id': new mongodb.ObjectId(this._id) })
      .toArray();
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
