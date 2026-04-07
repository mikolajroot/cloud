FROM node:22-alpine AS deps

WORKDIR /api/

COPY package.json package-lock.json ./

RUN npm ci --omit=dev


FROM deps AS test

RUN npm install

COPY . .

RUN npm test





FROM node:22-alpine AS production

WORKDIR /api/

ENV NODE_ENV=production

COPY --from=test /app/package.json ./

COPY --from=deps /api/node_modules ./node_modules

COPY . .

RUN chown -R node:node /api

USER node

EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4001/health || exit 1

CMD ["node", "src/server.js"]