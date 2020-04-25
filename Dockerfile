FROM node:12.16.2-alpine

COPY . /temp

# build backend
WORKDIR /temp/backend
RUN npm install
RUN npm run build

# build frontend
WORKDIR /temp/frontend
RUN npm install
RUN npm run build

# only keep what we need
WORKDIR /
RUN mkdir /backend
RUN mv /temp/backend/build /backend
RUN mv /temp/backend/node_modules /backend
RUN mkdir frontend
RUN mv /temp/frontend/build /frontend
RUN rm -fr /temp

WORKDIR /backend
CMD npm run start:prod
