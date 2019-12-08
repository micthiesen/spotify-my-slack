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
      const expiresAt = new Date(now.getTime() + (1000 * authData.body.expires_in))

      await user.update({
        spotifyAccessToken: accessToken,
        spotifyExpiresAt: expiresAt
      })

      client.setAccessToken(accessToken)
    } catch (err) {
      console.warn(`Could not refresh Spotify access token for user ${user.id}:`, err)
    }
  }

  return client
}

module.exports.getArtistString = (spotifyItem) => {
  const artistNames = spotifyItem.artists.map((artist) => {
    return artist.name
  })
  if (artistNames.length > 0) {
    return `by ${artistNames.join(', ')}`
  } else {
    return ''
  }
}
