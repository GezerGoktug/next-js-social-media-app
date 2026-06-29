FROM node:18-alpine AS base

FROM base AS dependencies

RUN apk add --no-cache openssl  

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

FROM dependencies AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

COPY prisma ./prisma

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
