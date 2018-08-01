const eachLimit = require('async/eachLimit')
const emojis = require('./emojis')
const models = require('../models')
const spotify = require('./spotify')
const { WebClient } = require('@slack/client')

module.exports.updateStatuses = async function () {
  const users = await models.User.findAll()

  eachLimit(users, 4, async function (user, complete) {
    const spotifyClient = await spotify.getUserClient(user)
    const slackClient = new WebClient(user.slackAccessToken)

    try {
      const playerData = await spotifyClient.getMyCurrentPlaybackState()
      const statusText = playerData.body.is_playing
        ? `${playerData.body.item.name} by ${playerData.body.item.artists[0].name}`
        : null
      const statusEmoji = playerData.body.is_playing
        ? emojis.getStatusEmoji(playerData.body.item)
        : null
      await slackClient.users.profile.set({
        profile: { status_text: statusText, status_emoji: statusEmoji }
      })
      console.log('Updated status for user', user.id)
    } catch (err) {
      console.warn('Updating status failed for', user.id, err)
    }

    complete()
  })
}
