// =============================================================
// Backend tests using Node's built-in test runner (node:test).
// Run with: node --test back/test/server.test.js
// =============================================================

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { handler } = require('../server');

let server;
let baseUrl;

// Start the server on a random free port before the tests
test.before(async () => {
  server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

// Stop the server after the tests
test.after(() => server.close());

test('GET /api/hello runs hello.wasm on the server', async () => {
  const res = await fetch(`${baseUrl}/api/hello`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.message, 'Hello World from WebAssembly!');
  assert.strictEqual(body.sum, 12);
});

test('GET / serves the frontend page', async () => {
  const res = await fetch(`${baseUrl}/`);
  const html = await res.text();
  assert.strictEqual(res.status, 200);
  assert.match(html, /Hello World/);
});

test('The .wasm file is served with the application/wasm MIME type', async () => {
  const res = await fetch(`${baseUrl}/wasm/hello.wasm`);
  assert.strictEqual(res.headers.get('content-type'), 'application/wasm');
});

test('Unknown files return 404', async () => {
  const res = await fetch(`${baseUrl}/does-not-exist.txt`);
  assert.strictEqual(res.status, 404);
});
