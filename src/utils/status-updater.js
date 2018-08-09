const emojis = require('./emojis')
const models = require('../models')
const spotify = require('./spotify')
const { WebClient } = require('@slack/client')

module.exports.updateStatuses = async function () {
  const timerStart = Date.now()
  const users = await models.User.findAll()
  var successes = 0
  var skips = 0
  var failures = 0

  for (const user of users) {
    const spotifyClient = await spotify.getUserClient(user)

    // retrieve Spotify plater state
    try {
      var playerData = await spotifyClient.getMyCurrentPlaybackState()
    } catch (err) {
      console.warn(`Retrieving Spotify player state failed for user ${user.id}:`, err)
      failures += 1
      continue
    }

    // update Slack status
    try {
      if (playerData.body.is_playing) {
        await setUserStatus(user, playerData.body.item)
        successes += 1
      } else if (user.statusSetLastTime) {
        await clearUserStatus(user)
        successes += 1
      } else {
        skips += 1
      }
    } catch (err) {
      if (err.data && err.data.error === 'token_revoked') {
        console.log(`Token revoked for user ${user.id}. Deleting user...`)
        try { await user.destroy() } catch (err) { console.error(err) }
        skips += 1
      } else {
        console.warn(`Updating Slack status failed for user ${user.id}:`, err)
        failures += 1
      }
    }
  }

  const timerEnd = Date.now()
  const timeSpent = (timerEnd - timerStart) / 1000

  console.log(`Updated ${successes} of ${users.length} users (${skips} skipped, ${failures} failed) [${timeSpent}s]`)
}

// helper functions
const setUserStatus = async (user, spotifyItem) => {
  const slackClient = new WebClient(user.slackAccessToken)
  const statusText = `${spotifyItem.name} by ${spotifyItem.artists[0].name}`
  const statusEmoji = emojis.getStatusEmoji(spotifyItem)

  await slackClient.users.profile.set({
    profile: { status_text: statusText, status_emoji: statusEmoji }
  })
  if (!user.statusSetLastTime) { await user.update({ statusSetLastTime: true }) }
}

const clearUserStatus = async (user) => {
  const slackClient = new WebClient(user.slackAccessToken)

  await slackClient.users.profile.set({
    profile: { status_text: null, status_emoji: null }
  })
  await user.update({ statusSetLastTime: false })
}
