module.exports = function (req, res) {
  if (req.query.code) { req.session.spotifyAuthCode = req.query.code }
  res.redirect('/')
}
