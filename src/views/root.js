module.exports = function (req, res) {
  res.render('root', {
    hasSlackAccessToken: !!req.session.slackAccessToken,
    hasSpotifyAccessToken: !!req.session.spotifyAccessToken,
    userId: req.session.userId
  })
}
