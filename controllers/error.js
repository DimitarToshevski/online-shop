const get404 = (req, res, next) => {
  res.status(404).render('ejs/404', {
    pageTitle: 'Page Not Found',
    path: '404',
    mongo: req.session.isLoggedIn,
    isLoggedIn: req.session.isLoggedIn,
  });
};

module.exports = {
  get404,
};
