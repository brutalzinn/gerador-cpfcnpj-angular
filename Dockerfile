FROM node:16 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5001
RUN npm run build