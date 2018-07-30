const session = require('express-session')
const RedisStore = require('connect-redis')(session)

module.exports.build = function () {
  const sessionOpts = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SSS_SECRET_KEY
  }
  if (process.env.REDISCLOUD_URL) {
    sessionOpts.store = new RedisStore({ url: process.env.REDISCLOUD_URL })
  } else {
    console.warn('Falling back to memory session storage')
  }

  return session(sessionOpts)
}
