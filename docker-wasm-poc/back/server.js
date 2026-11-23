// =============================================================
// Backend: simple "Hello World" REST API
// Uses only Node.js built-in modules, so it needs NO dependencies.
// It runs inside a Docker container (see back/Dockerfile).
// =============================================================

const http = require('http');
const os = require('os');

// The port can be changed with an environment variable.
// Docker Compose sets PORT=3000 (see docker-compose.yml).
const PORT = process.env.PORT || 3000;

// Handler: decides what to answer for each URL.
function handler(req, res) {
  // GET /api/hello -> main "Hello World" endpoint
  if (req.url === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'Hello World from the Docker backend!',
        // Inside Docker, the hostname is the container ID.
        // This proves the code is running inside a container.
        container: os.hostname(),
        time: new Date().toISOString(),
      })
    );
    return;
  }

  // GET /api/health -> used by Docker to know if the service is alive
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Any other URL -> 404 Not Found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

// Create the HTTP server with our handler.
const server = http.createServer(handler);

// Only start listening when this file is run directly ("node server.js").
// When the tests import it, they start it themselves on a random port.
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

module.exports = { server, handler };
