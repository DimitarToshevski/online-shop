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
