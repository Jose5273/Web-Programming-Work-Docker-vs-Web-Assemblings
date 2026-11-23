// =============================================================
// Backend: Node.js server with NO dependencies
//  - Serves the frontend files (front/ folder)
//  - GET /api/hello runs the SAME hello.wasm file on the server
// This shows that WebAssembly also works outside the browser.
// =============================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const FRONT_DIR = path.join(__dirname, '..', 'front');
const WASM_FILE = path.join(FRONT_DIR, 'wasm', 'hello.wasm');

// MIME types: tell the browser what kind of file it receives.
// IMPORTANT: .wasm files must be sent as "application/wasm".
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.wasm': 'application/wasm',
};

// ---------- Run hello.wasm on the server ----------
async function runWasm() {
  const bytes = fs.readFileSync(WASM_FILE); // 1. read the binary file
  let instance;
  let text = '';

  // 2. Imports: the "log" function that Wasm calls to send its text
  const imports = {
    env: {
      log: (pointer, length) => {
        const memory = new Uint8Array(instance.exports.memory.buffer, pointer, length);
        text = new TextDecoder().decode(memory);
      },
    },
  };

  // 3. Compile and instantiate, then call the exported functions
  ({ instance } = await WebAssembly.instantiate(bytes, imports));
  instance.exports.hello();                 // fills "text"
  const sum = instance.exports.add(5, 7);   // 12

  return { message: text, sum, runtime: `Node.js ${process.version} (server side)` };
}

// ---------- Serve static files from front/ ----------
function serveStatic(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.normalize(path.join(FRONT_DIR, urlPath));

  // Security: never serve files outside the front/ folder
  if (!filePath.startsWith(FRONT_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const type = MIME_TYPES[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
}

// ---------- Main request handler ----------
async function handler(req, res) {
  if (req.url === '/api/hello') {
    try {
      const result = await runWasm();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }

  serveStatic(req, res);
}

const server = http.createServer(handler);

// Only start listening when this file is run directly ("node server.js").
// The tests import it and start it on a random port.
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = { handler, runWasm };
