FROM node:18-alpine

WORKDIR /usr/src/app

# Copy backend files
COPY back/package*.json ./back/

WORKDIR /usr/src/app/back
RUN npm install

WORKDIR /usr/src/app

COPY back/app.js ./back/
COPY back/views ./back/views
COPY back/public ./back/public

# Copy frontend files
COPY front ./front

WORKDIR /usr/src/app/back

EXPOSE 3000

CMD ["npm", "start"]
