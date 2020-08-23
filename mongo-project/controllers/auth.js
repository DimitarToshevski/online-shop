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
  req.session.isLoggedIn = true;
  res.redirect('/mongo');
};

module.exports = {
  getLogin,
  postLogin,
};
