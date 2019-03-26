FROM node:10.15.3

RUN curl https://cli-assets.heroku.com/install.sh | sh
COPY package.json package-lock.json /spotify-my-slack/
WORKDIR /spotify-my-slack
RUN npm install
COPY .env .sequelizerc Procfile /spotify-my-slack/

EXPOSE 5000
ENTRYPOINT ["npm", "run"]
CMD ["watch"]