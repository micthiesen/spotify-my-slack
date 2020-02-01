const spotify = require("../utils/spotify");
const userManager = require("../utils/user-manager");

module.exports = async function(req, res) {
  delete req.session.userId;
  if (!req.query.code) {
    console.warn("Couldn't get grant code from Spotify");
    res.redirect("/");
    return;
  }

  const spotifyClient = spotify.buildClient();
  const now = new Date();
  try {
    const authData = await spotifyClient.authorizationCodeGrant(req.query.code);
    spotifyClient.setAccessToken(authData.body.access_token);
    const meData = await spotifyClient.getMe();

    const expiresAt = new Date(now.getTime() + 1000 * authData.body.expires_in);
    req.session.spotifyId = meData.body.id;
    req.session.spotifyAccessToken = authData.body.access_token;
    req.session.spotifyExpiresAt = expiresAt;
    req.session.spotifyRefreshToken = authData.body.refresh_token;
    await userManager.trySavingUser(req.session);
    await req.session.save();
  } catch (err) {
    console.warn("Error processing spotify grant callback", err);
  }

  res.redirect("/");
};
