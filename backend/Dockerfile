FROM node:24-alpine AS deps

WORKDIR /api/

COPY package.json package-lock.json ./

RUN npm ci --omit=dev



FROM node:24-alpine AS production

WORKDIR /api/

ENV NODE_ENV=production

COPY --from=deps /api/node_modules ./node_modules

COPY . .

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4001/health || exit 1

EXPOSE 4001

USER node

CMD ["node", "src/server.js"]