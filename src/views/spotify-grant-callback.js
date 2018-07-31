const spotify = require('../utils/spotify')
const userManager = require('../utils/user-manager.js')

module.exports = async function (req, res) {
  if (!req.query.code) {
    console.warn('Couldn\'t get grant code from Spotify')
    res.redirect('/')
    return
  }

  const spotifyClient = spotify.buildClient()
  const now = new Date()
  try {
    const authData = await spotifyClient.authorizationCodeGrant(req.query.code)
    spotifyClient.setAccessToken(authData.body['access_token'])
    const meData = await spotifyClient.getMe()

    const expiresAt = new Date(now.getTime() + (1000 * authData.body['expires_in']))
    console.log(expiresAt)
    req.session.spotifyAccessToken = authData.body['access_token']
    req.session.spotifyExpiresAt = expiresAt
    req.session.spotifyId = meData.body['id']
    req.session.spotifyRefreshToken = authData.body['refresh_token']
    userManager.trySavingUser(req.session)
  } catch (err) {
    console.warn(err)
  }

  res.redirect('/')
}
