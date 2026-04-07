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

ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production

LABEL org.opencontainers.image.created=${BUILD_DATE} \
      org.opencontainers.image.version=${VERSION} \
      org.opencontainers.image.title=${NODE_ENV}


ENV NODE_ENV={NODE_ENV}

COPY --from=deps /api/node_modules ./node_modules

COPY src/server.js ./

RUN chown -R node:node /api

USER node

EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4001/health || exit 1

CMD ["node", "src/server.js"]