const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://admin:1234@cluster0.aqbio.mongodb.net/shop?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

const getMongoDb = () => {
  if (_db) {
    return _db;
  } else {
    console.error('Could not find db!');
  }
};

const mongoConnect = (callback) => {
  client.connect((err) => {
    if (!err) {
      console.log('Connected to MongoDB!');

      _db = client.db();

      callback();
    } else {
      return console.warn(err);
    }
  });
};

module.exports = { mongoConnect, getMongoDb };
