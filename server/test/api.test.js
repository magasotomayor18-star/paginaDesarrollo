const assert = require("node:assert/strict");
const { createServer } = require("node:http");
const test = require("node:test");
const createApp = require("../index");

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
