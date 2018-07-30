const spotifyApi = require('../spotify-api')

module.exports = function (req, res) {
  if (!req.query.code) {
    console.error('Couldn\'t get grant code from Spotify')
    res.redirect('/')
    return
  }

  spotifyApi.authorizationCodeGrant(req.query.code)
    .then((data) => {
      req.session.spotifyExpiresIn = data.body['expires_in']
      req.session.spotifyAccessToken = data.body['access_token']
      req.session.spotifyRefreshToken = data.body['refresh_token']
      res.redirect('/')
    })
    .catch((err) => {
      console.error(err)
      res.redirect('/')
    })
}
