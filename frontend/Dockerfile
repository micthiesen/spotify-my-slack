FROM node:12.16.2-alpine

COPY ./frontend/package*.json /frontend/
RUN cd /frontend && npm install

COPY ./tsconfig.json /
COPY ./frontend/tsconfig.json /frontend/

WORKDIR /frontend
ENTRYPOINT ["npm", "run"]
CMD ["start"]

EXPOSE 7001
