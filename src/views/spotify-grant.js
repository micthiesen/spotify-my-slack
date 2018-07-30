const AUTHORIZATION_SCOPES = ['user-read-currently-playing']
const spotify = require('../utils/spotify')
const spotifyClient = spotify.buildClient()

module.exports = function (req, res) {
  const authorizeUrl = spotifyClient.createAuthorizeURL(AUTHORIZATION_SCOPES)
  res.redirect(authorizeUrl)
}
