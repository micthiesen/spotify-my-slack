const session = require('express-session')
const RedisStore = require('connect-redis')(session)

module.exports = function () {
  const sessionOpts = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SSS_SECRET_KEY
  }
  sessionOpts.store = new RedisStore({ url: process.env.REDIS_URL })
  return session(sessionOpts)
}
