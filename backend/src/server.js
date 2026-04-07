import cors from "cors";
import express from "express";
import os from "node:os";
import { pathToFileURL } from "node:url";

const defaultItems = [
  { id: 1, name: "Laptop Pro 14", price: 6499, createdAt: new Date().toISOString() },
  { id: 2, name: "Słuchawki ANC X2", price: 899, createdAt: new Date().toISOString() },
  { id: 3, name: "Monitor UltraWide 34", price: 2199, createdAt: new Date().toISOString() }
];

export function createApp({
  now = () => new Date(),
  uptime = () => os.uptime(),
  instanceId = process.env.INSTANCE_ID,
  initialItems = defaultItems
} = {}) {
  const app = express();
  app.set("trust proxy", 1);

  const items = initialItems.map((item) => ({ ...item }));
  let nextId = items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
  let requestCount = 0;

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    requestCount++;
    next();
  });

  app.get("/items", (_req, res) => {
    res.json(items);
  });

  app.post("/items", (req, res) => {
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

    const createdItem = {
      id: nextId++,
      name: name.trim(),
      price: numericPrice,
      createdAt: now().toISOString()
    };

    items.push(createdItem);
    res.status(201).json(createdItem);
  });

  app.get("/stats", (_req, res) => {
    res.json({
      totalProducts: items.length,
      instanceId,
      generatedAt: now().toISOString(),
      totalRequests: requestCount
    });
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: uptime()
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
