if (process.env.NEW_RELIC_ENABLED === 'true') { require('newrelic') }
const assert = require('assert')
const express = require('express')
const path = require('path')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const views = require('./views')
const PORT = process.env.PORT || 5000

assert.ok(process.env.DATABASE_URL)
assert.ok(process.env.SET_STATUSES_SLEEP_INTERVAL)
assert.ok(process.env.SSS_SECRET_KEY)

/* express app setup */
const app = express()
const sessionOpts = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.SSS_SECRET_KEY
}
if (process.env.REDISCLOUD_URL) {
  sessionOpts.store = new RedisStore({
    url: process.env.REDISCLOUD_URL
  })
} else {
  console.warn('Falling back to memory session storage')
}
app.use(session(sessionOpts))
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/static', express.static(path.join(__dirname, '../node_modules')))
app.use('/vue', express.static(path.join(__dirname, 'vue')))
app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'ejs')

/* router setup */
app.get('/', views.root)
app.get('/clear-user-data', views.clearUserData)
app.get('/slack-grant', views.slackGrant)
app.get('/slack-grant-callback', views.slackGrantCallback)
app.get('/spotify-grant', views.spotifyGrant)
app.get('/spotify-grant-callback', views.spotifyGrantCallback)
app.get('/users', views.users)

/* work loop */
async function setStatuses () {
  console.log('Pretending to set Slack statuses')
  setTimeout(setStatuses, process.env.SET_STATUSES_SLEEP_INTERVAL)
}
setStatuses()

/* wait for requests */
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
