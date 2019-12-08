module.exports = function(req, res) {
  req.session.destroy();
  res.redirect("/");
};
