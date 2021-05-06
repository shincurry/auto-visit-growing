FROM node:16-alpine

WORKDIR /usr/src/app

COPY . .
COPY package*.json .

RUN yarn
