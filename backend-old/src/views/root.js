const models = require("../models");

module.exports = async function(req, res) {
  var user = null;
  if (req.session.hasOwnProperty("userId")) {
    try {
      user = await models.User.findByPk(req.session.userId);
    } catch (err) {
      console.error(`Error retrieving user ${req.session.userId} in root view`);
    }
  }

  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.render("root", {
    hasSlackAccessToken: !!req.session.slackAccessToken,
    hasSpotifyAccessToken: !!req.session.spotifyAccessToken,
    userId: req.session.userId,
    user: user
  });
};
