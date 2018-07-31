const models = require('../models')
const REQUIRED_DATA = [
  'slackId',
  'slackAccessToken',
  'spotifyId',
  'spotifyAccessToken',
  'spotifyExpiresAt',
  'spotifyRefreshToken'
]

module.exports.trySavingUser = async function (session) {
  if (!REQUIRED_DATA.every((p) => session.hasOwnProperty(p))) {
    console.log('Not creating user; not enough data')
    return
  }

  try {
    const user = await models.User.create({
      slackId: session.slackId,
      slackAccessToken: session.slackAccessToken,
      spotifyId: session.spotifyId,
      spotifyAccessToken: session.spotifyRefreshToken,
      spotifyExpiresAt: session.spotifyExpiresAt,
      spotifyRefreshToken: session.spotifyRefreshToken
    })
    session.user_id = user.id
    console.log('Created new user', user.id)
  } catch (err) {
    console.error(err)
  }
}
