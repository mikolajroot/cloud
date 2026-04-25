FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_module[s] ./node_modules/
COPY ./worker.js .


HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD pgrep -f "node worker.js" || exit 1

CMD ["node", "worker.js"]