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
COPY ./apps/marketplace-service/fixtures/ ./dist/apps/marketplace-service/fixtures
COPY ./apps/marketplace-service/assets/ ./dist/apps/marketplace-service/assets

EXPOSE 3027

CMD npm run start:marketplace-service:prod