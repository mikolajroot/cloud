FROM node:24-alpine

WORKDIR /api/

COPY package.json package-lock.json ./

ENV NODE_ENV=production

RUN npm ci --omit=dev

COPY . .

EXPOSE 4001

USER node

CMD ["node", "src/server.js"]