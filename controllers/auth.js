const bcrypt = require('bcryptjs');

const User = require('../models/user');

const getLogin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render('ejs/auth/login', {
    pageTitle: 'Login',
    path: '/login',
    mongo: false,
    isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
              res.redirect('/');
            });
          } else {
            return res.redirect('/login');
          }
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/login');
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getSignup = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render('ejs/auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    mongo: false,
    isLoggedIn,
  });
};

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ where: { email } })
    .then((fetchedUser) => {
      if (fetchedUser) {
        return res.redirect('/signup');
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          return User.create({
            email,
            password: hashedPassword,
          });
        })
        .then(() => {
          res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};

const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
};
