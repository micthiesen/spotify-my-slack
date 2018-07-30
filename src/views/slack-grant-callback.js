const { WebClient } = require('@slack/client')

const web = new WebClient()

module.exports = function (req, res) {
  if (!req.query.code) {
    console.warn('Couldn\'t get grant code from Slack')
    res.redirect('/')
    return
  }

  web.oauth.access({
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: req.query.code,
    redirect_uri: process.env.SLACK_REDIRECT_URI
  })
    .then((slackRes) => {
      console.log(slackRes)
      req.session.slackAccessToken = slackRes.access_token
      res.redirect('/')
    })
    .catch((err) => {
      console.warn(err)
      res.redirect('/')
    })
}
