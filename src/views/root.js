module.exports = function (req, res) {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.render('root', {
    hasSlackAccessToken: !!req.session.slackAccessToken,
    hasSpotifyAccessToken: !!req.session.spotifyAccessToken,
    userId: req.session.userId
  })
}
