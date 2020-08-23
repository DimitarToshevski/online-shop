const express = require('express');
// const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const sequelize = require('./util/sql-database');
const sqlAssistant = require('./util/sql-assistant');

const User = require('./models/user');

const MongoUser = require('./mongo-project/models/user');

const app = express();

const errorController = require('./controllers/error');

// app.engine(
//   'hbs',
//   expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs',
//   })
// );
// app.set('view engine', 'pug');
// app.set('view engine', 'hbs');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongoRoutes = require('./mongo-project/routes/main');

app.use(bodyParser.urlencoded({ extended: true })); // parsing the body (files need different parsers)
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      return MongoUser.findById('5f423a76f3b9d736507ff93c');
    })
    .then((user) => {
      req.mongoUser = new MongoUser(user);
      next();
    })
    .catch((err) => console.log(err));
});

// routes that are using controllers connected to MongoDB
app.use('/mongo', mongoRoutes);

// routes that are using controllers connected to MySQL
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// error page for both MySQL and MongoDB routes
app.use(errorController.get404);

// Database relations
sqlAssistant.setupDataRelations();

sequelize
  .sync() // creates tables for all sql models - use { force: true } to re-create the tables
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Dimitar', email: 'test@test.com' });
    }

    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => {
    return mongoose.connect(
      'mongodb+srv://admin:1234@cluster0.aqbio.mongodb.net/shop?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  })
  .then(() => {
    MongoUser.findOne().then((user) => {
      if (!user) {
        const newUser = new MongoUser({
          name: 'Dimitar',
          email: 'test@test.com',
          cart: { items: [] },
        });
      }
    });
    console.log('Listening on port: ', 3000);

    app.listen(3000);
  })
  .catch((err) => console.log(err));
