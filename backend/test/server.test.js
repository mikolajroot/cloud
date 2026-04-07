import assert from "node:assert/strict";
import http from "node:http";

import { createApp } from "../src/server.js";

function requestJson(server, path) {
  const address = server.address();

  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: "127.0.0.1",
        port: address.port,
        path,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      },
      (response) => {
        let body = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve({ statusCode: response.statusCode, body: JSON.parse(body) });
        });
      }
    );

    request.on("error", reject);
    request.end();
  });
}

async function withServer(app, callback) {
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  try {
    return await callback(server);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

describe("backend endpoints", () => {
  it("GET /health returns a healthy status and injected uptime", async () => {
    const app = createApp({ uptime: () => 42.5 });

    await withServer(app, async (server) => {
      const response = await requestJson(server, "/health");

      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body, {
        status: "ok",
        uptime: 42.5
      });
    });
  });

  it("GET /stats returns isolated state with deterministic time and request count", async () => {
    const app = createApp({
      instanceId: "test-instance",
      now: () => new Date("2026-04-07T10:00:00.000Z"),
      uptime: () => 0
    });

    await withServer(app, async (server) => {
      await requestJson(server, "/health");
      const response = await requestJson(server, "/stats");

      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body, {
        totalProducts: 3,
        instanceId: "test-instance",
        generatedAt: "2026-04-07T10:00:00.000Z",
        totalRequests: 2
      });
    });
  });
});