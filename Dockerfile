#GAMBIARRA PARA DEPLOY NO DOKKU

FROM node:16 AS ui-build
WORKDIR /usr/src/app
COPY . .
RUN npm install @angular/cli && npm install && npm run build

FROM node:16 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install
COPY server.js .

EXPOSE 5001

CMD ["node", "server.js"]