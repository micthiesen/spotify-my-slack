const AUTHORIZATION_SCOPES = ["users.profile:write"];

module.exports = function(req, res) {
  const authorizeUrl = `https://slack.com/oauth/authorize?client_id=${
    process.env.SLACK_CLIENT_ID
  }&scope=${AUTHORIZATION_SCOPES.join()}&redirect_uri=${
    process.env.SLACK_REDIRECT_URI
  }`;
  res.redirect(authorizeUrl);
};
