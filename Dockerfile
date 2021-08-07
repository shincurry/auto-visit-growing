FROM node:16-alpine

RUN apk add --update --no-cache chromium

# Do not use puppeteer embedded chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
ENV CHROMIUM_PATH="/usr/bin/chromium-browser"

WORKDIR /usr/src/app

COPY package*.json yarn.lock .
RUN yarn

COPY . .
RUN yarn build
