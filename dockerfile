FROM node:18.13.0

WORKDIR /app

ENV NODE_ENV=production

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

EXPOSE 3000

COPY . .

CMD ["node", "server.js"]