FROM node:10

WORKDIR /app

COPY webapp-node/package.json .
COPY webapp-node/package-lock.json .

RUN npm install

COPY webapp .

EXPOSE 3000

CMD npm start