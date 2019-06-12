if (process.env.NEW_RELIC_ENABLED === 'true') { require('newrelic') }
const assert = require('assert')
const express = require('express')
const models = require('./models')
const path = require('path')
const views = require('./views')
const sessionBuilder = require('./utils/session-builder')
const statusUpdater = require('./utils/status-updater')
const PORT = process.env.PORT || 5000

assert.ok(process.env.DATABASE_URL)
assert.ok(process.env.SSS_SECRET_KEY)
assert.ok(process.env.UPDATE_LOOP_DEFAULT_INTERVAL)

/* express app setup */
const app = express()
app.use(sessionBuilder())
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/static', express.static(path.join(__dirname, '../node_modules')))
app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'ejs')

/* router setup */
app.get('/', views.root)
app.get('/delete-account', views.deleteAccount)
app.get('/sign-out', views.signOut)
app.get('/slack-grant', views.slackGrant)
app.get('/slack-grant-callback', views.slackGrantCallback)
app.get('/spotify-grant', views.spotifyGrant)
app.get('/spotify-grant-callback', views.spotifyGrantCallback)

/* work loops */
async function initialUpdateLoops () {
  const users = await models.User.findAll({ attributes: ['id'] })
  users.forEach((user) => {
    console.log(`Starting update loop for user ${user.id} (${users.length} users total)`)
    statusUpdater.updateLoop(user.id)
  })
}
initialUpdateLoops()

/* wait for requests */
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
