const models = require('../models')
const statusUpdater = require('./status-updater')
const USER_PROPS = [
  'slackId',
  'slackAccessToken',
  'spotifyId',
  'spotifyAccessToken',
  'spotifyExpiresAt',
  'spotifyRefreshToken'
]
const USER_PROPS_SETUP = [
  'slackId',
  'spotifyId',
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
    const [user, created] = await models.User.findOrCreate({
      where: { slackId: session.slackId, spotifyId: session.spotifyId },
      defaults: createOpts
    })
    console.log(created ? 'Created new user' : 'Retrieved user', user.id)

    USER_PROPS_SETUP.forEach((prop) => { delete session[prop] })
    session.userId = user.id

    if (created) {
      console.log(`Starting update loop for new user ${user.id}`)
      statusUpdater.updateLoop(user.id)
    }
  } catch (err) {
    console.error(err)
  }
}
