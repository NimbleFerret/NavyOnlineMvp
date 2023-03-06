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

RUN npm install pm2 -g

EXPOSE 4020
CMD ["/bin/sh", "-c", "pm2-runtime 'npm run start:gameplay-service:prod'"]