FROM node:12

RUN npm install pm2 -g

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["pm2-runtime", "app.js"]
