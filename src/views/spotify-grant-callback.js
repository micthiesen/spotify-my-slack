const spotify = require('../utils/spotify')
const userManager = require('../utils/user-manager.js')

module.exports = function (req, res) {
  if (!req.query.code) {
    console.warn('Couldn\'t get grant code from Spotify')
    res.redirect('/')
    return
  }

  const spotifyClient = spotify.buildClient()

  spotifyClient.authorizationCodeGrant(req.query.code)
    .then((authData) => {
      // get the user's ID as well
      spotifyClient.setAccessToken(authData.body['access_token'])
      spotifyClient.getMe()
        .then((meData) => {
          req.session.spotifyId = meData.body['id']
          req.session.spotifyExpiresIn = authData.body['expires_in']
          req.session.spotifyAccessToken = authData.body['access_token']
          req.session.spotifyRefreshToken = authData.body['refresh_token']
          userManager.trySavingUser(req.session)
          res.redirect('/')
        })
        .catch((err) => {
          console.warn(err)
          res.redirect('/')
        })
    })
    .catch((err) => {
      console.warn(err)
      res.redirect('/')
    })
}
