import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "../index.js";
import prisma from "../models/prisma.js";

test("GET /api/health reports backend status", async (t) => {
  const server = createServer(createApp());
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );

  const address = server.address();
  assert.ok(address && typeof address !== "string");

  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.ok, true);
  assert.match(body.mensaje, /Backend de Brasa Urbana funcionando/);
});

test("creates a Prisma product delegate with the SQL Server adapter", async () => {
  assert.equal(typeof prisma.producto.count, "function");
  await prisma.$disconnect();
});
