# Spotify my Slack [![Build Status](https://travis-ci.com/micthiesen/spotify-my-slack.svg?branch=master)](https://travis-ci.com/micthiesen/spotify-my-slack) [![Dependencies](https://david-dm.org/micthiesen/spotify-my-slack.svg)](https://david-dm.org/micthiesen/spotify-my-slack)

<a href="https://slack.com/oauth/authorize?client_id=406841633714.406803330164&scope=users.profile:write&redirect_uri=https%3A%2F%2Fspotify-my-slack.herokuapp.com%2Fslack-grant-callback"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

## Local Development
1. Copy `.env.example` to `.env` and fill in the placeholders. Usually you
   should only have to change the following variables after creating both a
   Slack and Spotify development app:
   - `SLACK_CLIENT_ID`
   - `SLACK_CLIENT_SECRET`
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
1. Make sure Docker and Docker Compose are installed (I use Docker for Mac)
1. Run migrations: `$ docker-compose run --rm node sequelize db:migrate`
1. Start the server: `$ docker-compose up -d` (then `$ docker-compose logs -f`
   to follow logs)
1. The application will be accessible at http://localhost:5000

### Installing Dependencies on Host
Since Node.js and project dependencies are automatically installed inside the
Docker container, these steps are optional. Despite this, it is useful to have
dependencies installed on your host machine for linting, reference, and
management.
1. Ensure [nvm](https://github.com/nvm-sh/nvm) is installed. Run `$ nvm install`
1. Install the project dependencies on the host: `$ npm install`
1. To audit dependencies, run `$ npm audit`
1. To lint the project, run `$ ./node_modules/.bin/eslint src/`
   - The linting config is specified by `.eslintrc.yml` which should be used
     automatically

### Managing the Database
[Sequelize](https://sequelize.org/) (an ORM) is used to manage database models
and migrations.
1. Sequelize CLI is available via `$ docker-compose run --rm node sequelize`
1. Options are automatically provided to the command from `.sequelizerc`
1. To create a migration, use
   `$ docker-compose run --rm node makemigration <name>`. A specific script has
   been created due to argument conflicts with `docker-compose run`
