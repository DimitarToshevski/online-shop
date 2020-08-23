const MongoUser = require('../models/user');

const getLogin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render('ejs/auth/login', {
    pageTitle: 'Login',
    path: '/login',
    mongo: true,
    isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  MongoUser.findById('5f423a76f3b9d736507ff93c')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.mongoUser = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/mongo');
      });
    })
    .catch((err) => console.log(err));
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/mongo/login');
  });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
};
