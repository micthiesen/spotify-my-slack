module.exports = function (req, res) {
  res.render('root', {
    hasSlackAccessToken: !!req.session.slackAccessToken,
    hasSpotifyAuthCode: !!req.session.spotifyAuthCode
  })
}
