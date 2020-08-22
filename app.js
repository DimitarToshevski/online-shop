const express = require('express');
// const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./util/database');
const sqlAssistant = require('./util/sql-assistant');

const User = require('./models/user');

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
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/mongo', mongoRoutes);

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Database relations
sqlAssistant.setupDataRelations();

sequelize
  .sync()
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
    app.listen(3000);
  })
  .catch((err) => console.log(err)); // creates tables for all your models
