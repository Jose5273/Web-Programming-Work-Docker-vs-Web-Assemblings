// =============================================================
// Backend unit tests using Node's built-in test runner (node:test).
// Run with: node --test back/test/server.test.js
// GitHub Actions runs these tests on every push to main, qa and dev.
// =============================================================

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { handler } = require('../server');

let server;
let baseUrl;

// Before the tests: start the server on a random free port (port 0).
test.before(async () => {
  server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

// After the tests: stop the server.
test.after(() => server.close());

test('GET /api/hello returns the Hello World message', async () => {
  const res = await fetch(`${baseUrl}/api/hello`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.match(body.message, /Hello World/);
});

test('GET /api/health returns status ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');
});

test('Unknown routes return 404', async () => {
  const res = await fetch(`${baseUrl}/does-not-exist`);
  assert.strictEqual(res.status, 404);
});
