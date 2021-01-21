FROM node:lts-alpine

RUN mkdir /app

WORKDIR /app

COPY . .

RUN yarn

COPY . .