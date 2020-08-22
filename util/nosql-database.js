const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://admin:1234@cluster0.aqbio.mongodb.net/<dbname>?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongoConnect = (callback) => {
  client.connect((err) => {
    if (!err) {
      console.log('Connected to MongoDB!');
      callback();
      // const collection = client.db('test').collection('devices');
      // perform actions on the collection object
      // client.close();
    } else {
      return console.warn(err);
    }
  });
};

module.exports = mongoConnect;
