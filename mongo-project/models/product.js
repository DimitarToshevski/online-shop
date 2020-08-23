const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);

// class Product {
//   _id;
//   title;
//   price;
//   description;
//   imageUrl;
//   userId;

//   constructor(rawObject) {
//     if (rawObject) {
//       this._id = rawObject.id ? new mongodb.ObjectId(rawObject.id) : null;
//       this.title = rawObject.title;
//       this.price = rawObject.price;
//       this.description = rawObject.description;
//       this.imageUrl = rawObject.imageUrl;
//       this.userId = rawObject.userId;
//     }
//   }

//   save() {
//     const db = getMongoDb().collection('products');

//     let dbOp;

//     if (this._id) {
//       dbOp = db.updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         {
//           $set: this,
//         }
//       );
//     } else {
//       dbOp = db.insertOne(this);
//     }

//     return dbOp.catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     return getMongoDb()
//       .collection('products')
//       .find()
//       .toArray()
//       .catch((err) => console.log(err));
//   }

//   static findById(id) {
//     return getMongoDb()
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .catch((err) => console.log(err));
//   }

//   static deleteById(id) {
//     return getMongoDb()
//       .collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(id) })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
