const eachLimit = require('async/eachLimit')
const { WebClient } = require('@slack/client')
const models = require('../models')
const spotify = require('./spotify')

module.exports.updateStatuses = async function () {
  const users = await models.User.findAll()

  eachLimit(users, 4, async function (user, complete) {
    const spotifyClient = await spotify.getUserClient(user)
    const slackClient = new WebClient(user.slackAccessToken)

    try {
      const playerData = await spotifyClient.getMyCurrentPlaybackState()
      const status = `${playerData.body.item.name} by ${playerData.body.item.artists[0].name}`
      await slackClient.users.profile.set({
        profile: { status_text: status, status_emoji: ':headphones:' }
      })
      console.log('Updated status for user', user.id)
    } catch (err) {
      console.warn('Updating status failed for', user.id, err)
    }

    complete()
  })
}
