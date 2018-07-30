const spotifyApi = require('../utils/spotify-api')

module.exports = function (req, res) {
  if (!req.query.code) {
    console.warn('Couldn\'t get grant code from Spotify')
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
      console.warn(err)
      res.redirect('/')
    })
}
