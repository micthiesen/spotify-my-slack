FROM node:12.16.2-alpine

COPY ./backend/package*.json /backend/
RUN cd /backend && npm install

COPY ./tsconfig.json /
COPY ./backend/tsconfig.json /backend/
COPY ./backend/tsconfig.build.json /backend/
COPY ./backend/nest-cli.json /backend/

WORKDIR /backend
ENTRYPOINT ["npm", "run"]
CMD ["start"]

EXPOSE 7000
