# Spotify my Slack [![Build Status](https://travis-ci.com/micthiesen/spotify-my-slack.svg?branch=master)](https://travis-ci.com/micthiesen/spotify-my-slack) [![Dependencies](https://david-dm.org/micthiesen/spotify-my-slack.svg)](https://david-dm.org/micthiesen/spotify-my-slack)

## Local Development
1. Have a local Postgres server running
1. Copy `.env.example` to `.env` and fill in the placeholders
1. Install [nvm](https://github.com/creationix/nvm) then run `$ nvm install && npm install`
1. `$ npm run watch` to start the server

### Sequelize ORM
1. Sequelize CLI is available at `$ ./node_modules/.bin/sequelize`
1. Options are automatically provided to the command from `.sequelizerc`
