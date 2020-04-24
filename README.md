# Spotify my Slack ![test](https://github.com/micthiesen/spotify-my-slack/workflows/test/badge.svg?branch=master)

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
