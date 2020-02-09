# Spotify my Slack ![test](https://github.com/micthiesen/spotify-my-slack/workflows/test/badge.svg?branch=master)

<a href="https://slack.com/oauth/authorize?client_id=406841633714.406803330164&scope=users.profile:write&redirect_uri=https%3A%2F%2Fspotify-my-slack.herokuapp.com%2Fslack-grant-callback"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

## Local Development

1. Copy `backend/.env.example` to `backend/.env` and fill in the placeholders. Usually you
   should only have to change the following variables after creating both a Slack and
   Spotify development app:
   - `SLACK_CLIENT_ID`
   - `SLACK_CLIENT_SECRET`
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
1. Make sure Docker and Docker Compose are installed (I use Docker for Mac)
1. The application will be accessible at [localhost:5000](http://localhost:5000)
