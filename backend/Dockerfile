FROM node:24-alpine AS deps

WORKDIR /api/

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM node:24-alpine AS production

WORKDIR /api/

ENV NODE_ENV=production


COPY --from=deps /api/node_modules ./node_modules

COPY . .

EXPOSE 4001

USER node

CMD ["node", "src/server.js"]