const models = require('../models')
const USER_PROPS = [
  'slackId',
  'slackAccessToken',
  'spotifyId',
  'spotifyAccessToken',
  'spotifyExpiresAt',
  'spotifyRefreshToken'
]

module.exports.trySavingUser = async function (session) {
  if (!USER_PROPS.every((prop) => session.hasOwnProperty(prop))) {
    console.log('Not creating user; not enough data')
    return
  }

  try {
    const createOpts = USER_PROPS.reduce((opts, prop) => {
      opts[prop] = session[prop]
      return opts
    }, {})
    const user = await models.User.create(createOpts)

    USER_PROPS.forEach((prop) => { delete session[prop] })
    session.user_id = user.id
    console.log('Created new user', user.id)
  } catch (err) {
    console.error(err)
  }
}
