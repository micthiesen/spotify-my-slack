const { WebClient } = require('@slack/client')

const web = new WebClient()

module.exports = async function (req, res) {
  if (!req.query.code) {
    console.warn('Couldn\'t get grant code from Slack')
    res.redirect('/')
    return
  }

  try {
    const slackRes = await web.oauth.access({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code,
      redirect_uri: process.env.SLACK_REDIRECT_URI
    })
    req.session.slackAccessToken = slackRes.access_token
  } catch (err) {
    console.warn(err)
  }

  res.redirect('/')
}
