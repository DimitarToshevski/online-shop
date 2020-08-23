const getLogin = (req, res, next) => {
  res.render('ejs/auth/login', {
    pageTitle: 'Login',
    path: '/login',
    mongo: true,
  });
};

module.exports = {
  getLogin,
};
