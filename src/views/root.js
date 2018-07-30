module.exports = function (req, res) {
  res.render('root', {
    hasSlackAuthCode: !!req.session.slackAuthCode,
    hasSpotifyAuthCode: !!req.session.spotifyAuthCode
  })
}
