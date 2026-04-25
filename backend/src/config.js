function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function parsePositiveNumber(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export const config = {
  instanceName: process.env.INSTANCE_NAME || "product-dashboard-backend",
  port: parsePositiveInt(process.env.PORT, 4001),

  limits: {
    jsonBodyLimit: process.env.JSON_BODY_LIMIT || "100kb",
    defaultPageSize: parsePositiveInt(process.env.DEFAULT_PAGE_SIZE, 25),
    maxPageSize: parsePositiveInt(process.env.MAX_PAGE_SIZE, 100)
  },

  timeouts: {
    requestMs: parsePositiveInt(process.env.REQUEST_TIMEOUT_MS, 15_000),
    headersMs: parsePositiveInt(process.env.HEADERS_TIMEOUT_MS, 16_000),
    keepAliveMs: parsePositiveInt(process.env.KEEP_ALIVE_TIMEOUT_MS, 5_000)
  },

  cache: {
    statsTtlSeconds: parsePositiveInt(process.env.STATS_CACHE_TTL_SECONDS, 10)
  },

  postgres: {
    host: process.env.PGHOST || "postgres",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "password",
    database: process.env.PGDATABASE || "product_db",
    port: parsePositiveInt(process.env.PGPORT, 5432),
    connectionTimeoutMs: parsePositiveInt(process.env.PG_CONNECTION_TIMEOUT_MS, 5_000),
    idleTimeoutMs: parsePositiveInt(process.env.PG_IDLE_TIMEOUT_MS, 10_000)
  },

  redis: {
    host: process.env.REDIS_HOST || "redis",
    port: parsePositiveInt(process.env.REDIS_PORT, 6379),
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    connectTimeoutMs: parsePositiveNumber(process.env.REDIS_CONNECT_TIMEOUT_MS, 5_000)
  }
};
