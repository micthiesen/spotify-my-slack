# Spotify my Slack [![Build Status](https://travis-ci.com/micthiesen/spotify-my-slack.svg?branch=master)](https://travis-ci.com/micthiesen/spotify-my-slack) [![Dependencies](https://david-dm.org/micthiesen/spotify-my-slack.svg)](https://david-dm.org/micthiesen/spotify-my-slack)

<a href="https://slack.com/oauth/authorize?client_id=406841633714.406803330164&scope=users.profile:write&redirect_uri=https%3A%2F%2Fspotify-my-slack.herokuapp.com%2Fslack-grant-callback"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

## Local Development
1. Have a [local Postgres server](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup) running
1. Copy `.env.example` to `.env` and fill in the placeholders
1. Install [nvm](https://github.com/creationix/nvm) then run `$ nvm install && npm install`
1. Run migrations: `$ ./node_modules/.bin/sequelize db:migrate`
1. Install the [Heroku Toolbelt](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
1. `$ npm run watch` to start the server

### Sequelize ORM
1. Sequelize CLI is available at `./node_modules/.bin/sequelize`
1. Options are automatically provided to the command from `.sequelizerc`
