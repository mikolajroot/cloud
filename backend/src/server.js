import cors from "cors";
import express from "express";
import os from "node:os";

const app = express();
app.set('trust proxy', 1);
const port = Number(process.env.PORT) || 4001;
const instanceId = process.env.INSTANCE_ID;

let nextId = 4;
const items = [
  { id: 1, name: "Laptop Pro 14", price: 6499, createdAt: new Date().toISOString() },
  { id: 2, name: "Słuchawki ANC X2", price: 899, createdAt: new Date().toISOString() },
  { id: 3, name: "Monitor UltraWide 34", price: 2199, createdAt: new Date().toISOString() }
];

app.use(cors());
app.use(express.json());

let requestCount = 0;

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
    createdAt: new Date().toISOString()
  };

  items.push(createdItem);
  res.status(201).json(createdItem);
});

app.get("/stats", (_req, res) => {
  res.json({
    totalProducts: items.length,
    instanceId,
    generatedAt: new Date().toISOString(),
    totalRequests: requestCount
  });
});

app.get("/health",(_req,res) => {
  res.json({
    status: "ok",
    uptime: os.uptime()
  });
} )

app.listen(port, () => {
  console.log(`Product Dashboard API is running on http://localhost:${port}`);
  console.log(`Backend instance id: ${instanceId}`);
});
