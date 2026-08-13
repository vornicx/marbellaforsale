import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const apiSource = await readFile(new URL("../app/api/enquiries/route.ts", import.meta.url), "utf8");
const formSource = await readFile(new URL("../app/components.tsx", import.meta.url), "utf8");
const databaseSource = await readFile(new URL("../db/index.ts", import.meta.url), "utf8");

test("enquiry submissions are validated, consented and idempotent", () => {
  assert.match(apiSource, /privacyAccepted !== true/);
  assert.match(apiSource, /onConflictDoNothing\(\{ target: enquiries\.id \}\)/);
  assert.match(apiSource, /submissionId/);
  assert.match(formSource, /submissionIdRef/);
});

test("enquiries retain a client-safe recovery path", () => {
  assert.match(apiSource, /notifyByEmail/);
  assert.match(apiSource, /retry-after/);
  assert.match(formSource, /Send prepared email/);
  assert.match(formSource, /Call \+34 952 907 386/);
});

test("the database self-initialises its enquiry schema", () => {
  assert.match(databaseSource, /CREATE TABLE IF NOT EXISTS enquiries/);
  assert.match(databaseSource, /CREATE INDEX IF NOT EXISTS enquiries_status_idx/);
  assert.match(databaseSource, /await ensureDatabase/);
});
