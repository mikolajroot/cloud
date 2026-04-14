import cors from "cors";
import express from "express";
import os from "node:os";
import { pathToFileURL } from "node:url";
const { Pool } = require('pg');
const redis = require('redis');

const pgPool = new Pool({
  host: process.env.PGHOST || 'postgres',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'product_db',
  port: 5432,
});

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`
});
redisClient.connect().catch(console.error);



export function createApp({
  now = () => new Date(),
  instanceId = process.env.INSTANCE_ID,
} = {}) {
  const app = express();
  app.set("trust proxy", 1);

  let requestCount = 0;

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    requestCount++;
    next();
  });

  app.get('/items', async (req, res) => {
    try {
      const { rows } = await pgPool.query('SELECT * FROM items');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/items", async (req, res) => {
    const { name, price } = req.body ?? {};

    if (typeof name !== "string" || name.trim().length < 2) {
      res.status(400).json({ message: "Pole name musi mieć min. 2 znaki." });
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      res.status(400).json({ message: "Pole price musi być liczbą >= 0." });
      return;
    }

    try {
      const { rows } = await pgPool.query(
        'INSERT INTO items (name, price) VALUES ($1, $2) RETURNING *',
        [name.trim(), numericPrice]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

    res.status(201).json(createdItem);
  });

  app.get('/stats', async (req, res) => {
    try {
      const cachedStats = await redisClient.get('api_stats');
      if (cachedStats) {
        res.set('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedStats));
      }

      const statsData = { total_items: 42, active_users: 15, time: Date.now() };


      await redisClient.setEx('api_stats', 10, JSON.stringify(statsData));

      res.set('X-Cache', 'MISS');
      res.json(statsData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.get('/health', async (req, res) => {
  let pgStatus = 'down';
  let redisStatus = 'down';

  try {
    await pgPool.query('SELECT 1');
    pgStatus = 'up';
  } catch (e) {}

  if (redisClient.isReady) {
    redisStatus = 'up';
  }

  res.json({
    status: 'ok',
    postgres: pgStatus,
    redis: redisStatus
  });
});

  return app;
}

export const app = createApp();

const isMainModule = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isMainModule) {
  const port = Number(process.env.PORT) || 4001;

  app.listen(port, () => {
    console.log(`Product Dashboard API is running on http://localhost:${port}`);
    console.log(`Backend instance id: ${process.env.INSTANCE_ID}`);
  });
}
