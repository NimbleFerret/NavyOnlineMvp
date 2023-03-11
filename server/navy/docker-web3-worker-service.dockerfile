FROM node:lts-bullseye-slim as builder

WORKDIR /app

COPY .env ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY package.json ./
COPY ./libs/ ./libs
COPY ./proto/ ./proto
COPY ./apps/ ./apps

RUN npm i
RUN npm run build

COPY ./proto/ ./dist/proto
COPY ./apps/web3-worker-service/assets/ ./dist/apps/web3-worker-service/assets

EXPOSE 3010

CMD npm run start:web3-worker-service:prod