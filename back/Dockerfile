FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY app.js .
COPY views ./views
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
