FROM node:12.16.2-alpine

# required for /scripts/pingme.sh
RUN apk --no-cache add curl

COPY . /temp

# build backend
WORKDIR /temp/backend
RUN npm install
RUN npm run build

RUN mkdir /backend
RUN mv build /backend
RUN mv node_modules /backend
RUN mv package.json /backend

# build frontend
WORKDIR /temp/frontend
RUN npm install
RUN npm run build

RUN mkdir /frontend
RUN mv build /frontend
RUN mv package.json /frontend

# include scripts
WORKDIR /temp/scripts
RUN mkdir /scripts
RUN mv pingme.sh /scripts

WORKDIR /
RUN rm -fr /temp

CMD cd backend && npm run start:prod
