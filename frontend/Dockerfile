FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


FROM node:22-alpine AS build

ARG NODE_ENV=production

WORKDIR /app

ENV NODE_ENV=${NODE_ENV}

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build


FROM nginx:alpine AS production

ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production

LABEL org.opencontainers.image.created=${BUILD_DATE} \
      org.opencontainers.image.version=${VERSION} \
      org.opencontainers.image.title=${NODE_ENV}

RUN rm /etc/nginx/conf.d/default.conf && \
    rm -rf /usr/share/nginx/html/* && \
    mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/run/nginx && \
    mkdir -p /run && \
    touch /run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx /var/run/nginx /run/nginx.pid /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

USER nginx

CMD ["nginx", "-g", "daemon off;"]

