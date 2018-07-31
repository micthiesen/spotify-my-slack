if (process.env.NEW_RELIC_ENABLED === 'true') { require('newrelic') }
const assert = require('assert')
const express = require('express')
const path = require('path')
const views = require('./views')
const sessionBuilder = require('./utils/session-builder')
const statusUpdater = require('./utils/status-updater')
const PORT = process.env.PORT || 5000

assert.ok(process.env.DATABASE_URL)
assert.ok(process.env.SET_STATUSES_SLEEP_INTERVAL)
assert.ok(process.env.SSS_SECRET_KEY)

/* express app setup */
const app = express()
app.use(sessionBuilder())
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/static', express.static(path.join(__dirname, '../node_modules')))
app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'ejs')

/* router setup */
app.get('/', views.root)
app.get('/clear-user-data', views.clearUserData)
app.get('/slack-grant', views.slackGrant)
app.get('/slack-grant-callback', views.slackGrantCallback)
app.get('/spotify-grant', views.spotifyGrant)
app.get('/spotify-grant-callback', views.spotifyGrantCallback)

/* work loop */
async function routineTasks () {
  statusUpdater.updateStatuses()
  setTimeout(routineTasks, process.env.SET_STATUSES_SLEEP_INTERVAL)
}
routineTasks()

/* wait for requests */
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
