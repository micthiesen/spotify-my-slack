const emojis = require('./emojis')
const models = require('../models')
const spotify = require('./spotify')
const { WebClient } = require('@slack/client')

module.exports.updateStatuses = async function () {
  const users = await models.User.findAll()
  var successes = 0
  var skips = 0
  var failures = 0

  for (const user of users) {
    const spotifyClient = await spotify.getUserClient(user)
    const slackClient = new WebClient(user.slackAccessToken)

    try {
      const playerData = await spotifyClient.getMyCurrentPlaybackState()

      if (playerData.body.is_playing) {
        const statusText = `${playerData.body.item.name} by ${playerData.body.item.artists[0].name}`
        const statusEmoji = emojis.getStatusEmoji(playerData.body.item)
        await slackClient.users.profile.set({
          profile: { status_text: statusText, status_emoji: statusEmoji }
        })
        if (!user.statusSetLastTime) { await user.update({ statusSetLastTime: true }) }
        successes += 1
      } else if (user.statusSetLastTime) {
        await slackClient.users.profile.set({
          profile: { status_text: null, status_emoji: null }
        })
        await user.update({ statusSetLastTime: false })
        successes += 1
      } else {
        skips += 1
      }
    } catch (err) {
      if (err.data && err.data.error === 'token_revoked') {
        console.log(`Token revoked for user ${user.id}. Deleting user...`)
        try { await user.destroy() } catch (err) { console.error(err) }
      } else {
        console.warn('Updating status failed for', user.id, err)
      }
      failures += 1
    }
  }

  console.log(`Updated statuses for ${successes} of ${users.length} users (${skips} skipped, ${failures} failed)`)
}
