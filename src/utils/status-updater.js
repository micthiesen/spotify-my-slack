const emojis = require('./emojis')
const models = require('../models')
const spotify = require('./spotify')
const { WebClient } = require('@slack/client')

// start an update loop for a user
module.exports.updateLoop = async function (userId) {
  try {
    const user = await models.User.findById(userId)
    if (!user) {
      console.log(`Stopping update loop; user ${userId} does not exist`)
      return
    }

    const updatePromise = new Promise(async (resolve) => { return performUpdate(user, resolve) })
    var [updateResult, interval] = await updatePromise
    console.log(interval)
    console.log(`Update result for user ${userId}: ${updateResult}`)
  } catch (err) {
    console.error(`Fatal error in update loop for user ${userId}: ${err}`)
  }

  setTimeout(() => { module.exports.updateLoop(userId) }, interval || process.env.UPDATE_LOOP_DEFAULT_INTERVAL)
}

// update a single user
const performUpdate = async (user, resolve) => {
  const spotifyClient = await spotify.getUserClient(user)

  // retrieve Spotify plater state
  try {
    var playerData = await spotifyClient.getMyCurrentPlaybackState()
  } catch (err) {
    if (err.headers['retry-after']) {
      console.info(`Spotify throttling requests for user ${user.id}; retry after ${err.headers['retry-after']}`)
      return resolve(['skip', parseInt(err.headers['retry-after']) * 1000])
    } else {
      console.warn(`Retrieving Spotify player state failed for user ${user.id}:`, err)
      return resolve(['failure', null])
    }
  }

  // update Slack status
  try {
    if (playerData.body.is_playing) {
      await setUserStatus(user, playerData.body.item)
      return resolve(['success', null])
    } else if (user.statusSetLastTime) {
      await clearUserStatus(user)
      return resolve(['success', null])
    } else {
      return resolve(['skip', null])
    }
  } catch (err) {
    if (err.data && err.data.error === 'token_revoked') {
      console.log(`Token revoked for user ${user.id}. Deleting user...`)
      try { await user.destroy() } catch (err) { console.error(err) }
      return resolve(['skip', null])
    } else {
      console.warn(`Updating Slack status failed for user ${user.id}:`, err)
      return resolve(['failure', null])
    }
  }
}

// helper functions
const setUserStatus = async (user, spotifyItem) => {
  const slackClient = new WebClient(user.slackAccessToken)
  const statusEmoji = emojis.getStatusEmoji(spotifyItem)
  var statusText = `${spotifyItem.name} ${spotify.getArtistString(spotifyItem)}`
  if (statusText.length > 100) {
    statusText = statusText.substr(0, 97).trim() + '...'
  }

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
