import assert from "node:assert/strict";
import test from "node:test";
import { parseSqlServerConnectionString } from "../models/sql-server-connection.js";

test("parses SQL Server options and brace-escaped credentials", () => {
  const config = parseSqlServerConnectionString(
    "sqlserver://localhost:1433;database=BrasaUrbana;user=app;password={pass;word}}};encrypt=false;trustServerCertificate=true",
  );

  assert.equal(config.server, "localhost");
  assert.equal(config.port, 1433);
  assert.equal(config.database, "BrasaUrbana");
  assert.equal(config.user, "app");
  assert.equal(config.password, "pass;word}");
  assert.deepEqual(config.options, {
    encrypt: false,
    trustServerCertificate: true,
  });
});

test("rejects incomplete or malformed SQL Server connection strings", () => {
  assert.throws(
    () => parseSqlServerConnectionString("postgresql://localhost/db"),
    /sqlserver:\/\/ scheme/,
  );
  assert.throws(
    () => parseSqlServerConnectionString("sqlserver://localhost;database=db"),
    /database, user, and password/,
  );
});
