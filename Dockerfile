FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm","run","dev" ]