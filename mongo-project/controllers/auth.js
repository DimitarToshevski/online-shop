const bcrypt = require('bcryptjs');

const MongoUser = require('../models/user');

const getLogin = (req, res, next) => {
  res.render('ejs/auth/login', {
    pageTitle: 'Login',
    path: '/login',
    mongo: true,
  });
};

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  MongoUser.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid credentials.');

        return res.redirect('/mongo/login');
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.mongoUser = user;
            return req.session.save(() => {
              res.redirect('/mongo');
            });
          } else {
            req.flash('error', 'Invalid credentials.');

            return res.redirect('/mongo/login');
          }
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/mongo/login');
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getSignup = (req, res, next) => {
  res.render('ejs/auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    mongo: true,
  });
};

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  MongoUser.findOne({ email })
    .then((fetchedUser) => {
      if (fetchedUser) {
        req.flash('error', 'Email already exists.');
        return res.redirect('/mongo/signup');
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new MongoUser({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then(() => {
          res.redirect('/mongo/login');
        });
    })
    .catch((err) => console.log(err));
};

const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/mongo/login');
  });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
};
