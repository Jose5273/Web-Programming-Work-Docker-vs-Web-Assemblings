// =============================================================
// Frontend logic
// Part 1: Docker POC  -> calls the backend API (another container)
// Part 2: Wasm POC    -> loads add.wasm and runs it in the browser
// =============================================================

// ---------- Part 1: Docker ----------

// Calls GET /api/hello. Nginx forwards (proxies) "/api/" requests
// to the backend container (see front/nginx.conf).
async function callBackend() {
  const output = document.getElementById('backend-result');
  output.textContent = 'Calling backend...';

  try {
    const response = await fetch('/api/hello');
    const data = await response.json();
    // Show the JSON response nicely formatted
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: backend not reachable. Is Docker Compose running?';
  }
}

// ---------- Part 2: WebAssembly ----------

let wasmAdd = null; // will hold the "add" function exported by Wasm

// Downloads the binary .wasm file, compiles it and keeps its exports.
async function loadWasm() {
  const button = document.getElementById('btn-wasm');
  try {
    const startTime = performance.now();

    // 1. Download the binary file
    const response = await fetch('wasm/add.wasm');
    const bytes = await response.arrayBuffer();

    // 2. Compile and instantiate the module
    const { instance } = await WebAssembly.instantiate(bytes);

    // 3. Save the exported function so JavaScript can call it
    wasmAdd = instance.exports.add;

    const loadTime = (performance.now() - startTime).toFixed(2);
    button.disabled = false;
    button.textContent = 'Add with Wasm';
    document.getElementById('wasm-result').textContent =
      `Module loaded (${bytes.byteLength} bytes) in ${loadTime} ms`;
  } catch (err) {
    button.textContent = 'Wasm failed to load';
    document.getElementById('wasm-result').textContent = 'Error: ' + err.message;
  }
}

// Reads the two inputs and calls the Wasm "add" function.
function addWithWasm() {
  const a = parseInt(document.getElementById('num-a').value, 10) || 0;
  const b = parseInt(document.getElementById('num-b').value, 10) || 0;

  const result = wasmAdd(a, b); // <- this runs inside WebAssembly

  document.getElementById('wasm-result').textContent =
    `${a} + ${b} = ${result}  (calculated by WebAssembly)`;
}

// ---------- Wire up the buttons ----------
document.getElementById('btn-backend').addEventListener('click', callBackend);
document.getElementById('btn-wasm').addEventListener('click', addWithWasm);

// Load the Wasm module as soon as the page opens
loadWasm();
