const spotifyApi = require('../spotify-api')
const AUTHORIZATION_SCOPES = ['user-read-currently-playing']

module.exports = function (req, res) {
  const authorizeUrl = spotifyApi.createAuthorizeURL(AUTHORIZATION_SCOPES)
  res.redirect(authorizeUrl)
}
