# Spotify my Slack [![Build Status](https://travis-ci.com/micthiesen/spotify-my-slack.svg?branch=master)](https://travis-ci.com/micthiesen/spotify-my-slack) [![Dependencies](https://david-dm.org/micthiesen/spotify-my-slack.svg)](https://david-dm.org/micthiesen/spotify-my-slack)

<a href="https://slack.com/oauth/authorize?client_id=406841633714.406803330164&scope=users.profile:write&redirect_uri=https%3A%2F%2Fspotify-my-slack.herokuapp.com%2Fslack-grant-callback"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

## Local Development
1. Copy `.env.example` to `.env` and fill in the placeholders
1. Make sure Docker and Docker Compose are installed (I use Docker for Mac)
1. Run migrations: `$ docker-compose run --rm node sequelize db:migrate`
1. Start the server: `$ docker-compose up`

## Local Dependencies
It is useful to have Node.js and dependencies installed locally for linting and management.
1. Ensure [nvm](https://github.com/nvm-sh/nvm) is installed. Run `nvm install`
1. Install the project dependencies locally: `npm install`
1. To audit dependencies, run `npm audit`

### Sequelize ORM
1. Sequelize CLI is available via `$ docker-compose run --rm node sequelize`
1. Options are automatically provided to the command from `.sequelizerc`
1. To create a migration, use `$ docker-compose run --rm node makemigration <name>`. A specific script has been created due to argument conflicts with `docker-compose run`
