# Spotify my Slack [![test](https://github.com/micthiesen/spotify-my-slack/workflows/test/badge.svg?branch=master)](https://github.com/micthiesen/spotify-my-slack/actions?query=workflow%3Atest)

Note that this project is currently undergoing a significant refactor and _is not
functional yet_. If you want to find a working version of SmS you'll have to dig through
the Git history a bit (likely a lot, actually).

## Local Development

1. Make sure Docker and Docker Compose are installed (I use Docker for Mac)
1. In the root of the project, do a `$ docker-compose up`
1. The application will be accessible at [localhost:7001](http://localhost:7001)

### Linting & References on the Host

1. Install [nvm](https://github.com/nvm-sh/nvm)
1. In the root of the project, install the correct node version: `$ nvm install`
1. Install dependencies for the frontend & backend:
   - In `frontend/`: `$ npm install`
   - In `backend/`: `$ npm install`

## Deploying to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
