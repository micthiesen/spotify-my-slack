const spotify = require('../utils/spotify')
const userManager = require('../utils/user-manager.js')

module.exports = async function (req, res) {
  if (!req.query.code) {
    console.warn('Couldn\'t get grant code from Spotify')
    res.redirect('/')
    return
  }

  const spotifyClient = spotify.buildClient()
  try {
    const authData = await spotifyClient.authorizationCodeGrant(req.query.code)
    spotifyClient.setAccessToken(authData.body['access_token'])
    const meData = await spotifyClient.getMe()

    req.session.spotifyId = meData.body['id']
    req.session.spotifyExpiresIn = authData.body['expires_in']
    req.session.spotifyExpiresAt =
    req.session.spotifyAccessToken = authData.body['access_token']
    req.session.spotifyRefreshToken = authData.body['refresh_token']
    userManager.trySavingUser(req.session)
  } catch (err) {
    console.warn(err)
  }

  res.redirect('/')
}
