const express = require('express');
// const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const MySqlDbStore = require('express-mysql-session')(session);
const { graphqlHTTP } = require('express-graphql');

// Local imports
const sequelize = require('./util/sql-database');
const sqlAssistant = require('./util/sql-assistant');
const isAuth = require('./middleware/is-auth');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

// Model imports
const User = require('./models/user');
const MongoUser = require('./mongo-project/models/user');

// Constants
const app = express();

const csrfProtection = csrf();

const MONGODB_URI =
  'mongodb+srv://admin:1234@cluster0.aqbio.mongodb.net/shop?retryWrites=true&w=majority';

const mySqlStoreOptions = {
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: '1234',
  database: 'shop',
};

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const mySqlStore = new MySqlDbStore(mySqlStoreOptions);

// Routes and error controller
const errorController = require('./controllers/error');
const graphqlController = require('./controllers/graphql');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const graphqlRoutes = require('./routes/graphql');
const shopRoutes = require('./routes/shop');
const mongoRoutes = require('./mongo-project/routes/main');

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

// Middlewares
app.use(bodyParser.urlencoded({ extended: true })); // parsing the body (files need different parsers)
app.use(bodyParser.json({ extended: true })); // parsing the body (files need different parsers)
app.use(express.static(path.join(__dirname, 'public')));

// Create a session
app.use(
  session({ secret: '1234', resave: false, saveUninitialized: false, store })
);

app.use(
  session({
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    store: mySqlStore,
  })
);

// for each post request look for csrf token
// app.use(csrfProtection);

// used for attaching error messages
app.use(flash());

app.post(
  '/graphql',
  graphqlController.stripQuery,
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
  })
);

// Store the MySQL user in the req
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findByPk(req.session.user.dataValues.id)
    .then((user) => {
      req.user = user;

      return req.user.createCart();
    })
    .then(() => {
      next();
    })
    .catch((err) => console.log(err));
});

// Store the Mongoose user in the req
app.use((req, res, next) => {
  if (!req.session.mongoUser) {
    return next();
  }

  MongoUser.findById(req.session.mongoUser._id)
    .then((user) => {
      req.mongoUser = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  const errorMessage = req.flash('error');
  const successMessage = req.flash('success');

  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = 'req.csrfToken()';
  res.locals.errorMessage = errorMessage.length > 0 ? errorMessage : undefined;
  res.locals.successMessage =
    successMessage.length > 0 ? successMessage : undefined;

  next();
});

// routes that are using controllers connected to MongoDB
app.use('/mongo', mongoRoutes);

// routes that are using controllers connected to MySQL
app.use('/admin', isAuth, adminRoutes);
app.use('/graphql', isAuth, graphqlRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// error page for both MySQL and MongoDB routes
app.use(errorController.get404);

// Database relations
sqlAssistant.setupDataRelations();

sequelize
  .sync() // creates tables for all sql models - use { force: true } to re-create the tables
  .then(() => {
    return mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  })
  .then(() => {
    console.log('Listening on port: ', process.env.PORT || 3000);

    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));
