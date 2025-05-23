FROM node:24-alpine3.20 AS dev
WORKDIR /app

COPY ./package.json .

RUN npm i

COPY . .

CMD [ "npm", "run", "dev" ]

