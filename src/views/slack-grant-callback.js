const web = require('../slack-api')

module.exports = function (req, res) {
  if (!req.query.code) {
    console.error('Couldn\'t get grant code from Slack')
    res.redirect('/')
  }

  web.oauth.access({
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: req.query.code,
    redirect_uri: process.env.SLACK_REDIRECT_URI
  })
    .then((slackRes) => {
      req.session.slackAccessToken = slackRes.access_token
      res.redirect('/')
    })
    .catch((err) => {
      console.error(err)
      res.redirect('/')
    })
}
