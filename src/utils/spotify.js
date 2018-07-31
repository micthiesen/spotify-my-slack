const SpotifyWebApi = require('spotify-web-api-node')

module.exports.buildClient = function () {
  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  })
}

module.exports.getUserClient = async function (user) {
  const client = module.exports.buildClient()
  client.setAccessToken(user.spotifyAccessToken)
  client.setRefreshToken(user.spotifyRefreshToken)

  const now = new Date()
  if (user.spotifyExpiresAt < now) {
    try {
      const authData = await client.refreshAccessToken()
      const accessToken = authData.body.access_token
      const refreshToken = authData.body.refresh_token || ''
      const expiresAt = refreshToken ? new Date(now.getTime() + (1000 * authData.body.expires_in)) : null

      user.update({
        spotifyAccessToken: accessToken,
        spotifyExpiresAt: expiresAt,
        spotifyRefreshToken: refreshToken
      })

      client.setAccessToken(accessToken)
      client.setRefreshToken(refreshToken)
      console.log('Spotify token refreshed for user', user.id)
    } catch (err) {
      console.warn('Could not refresh access token for user', user.id, err)
    }
  }

  return client
}
