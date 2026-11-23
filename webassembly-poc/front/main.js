// =============================================================
// Frontend logic
// Part 1: load hello.wasm in the browser
// Part 2: call its exported functions (hello and add)
// Part 3: call the backend, which runs the same .wasm on the server
// =============================================================

let wasm = null; // will hold the exports of the Wasm module

// ---------- Part 1: load the module ----------

async function loadWasm() {
  try {
    const startTime = performance.now();

    // 1. Download the binary file
    const response = await fetch('wasm/hello.wasm');
    const bytes = await response.arrayBuffer();

    // 2. Functions that JavaScript gives to Wasm (the "imports").
    //    Wasm calls log(pointer, length) to send us its text.
    const imports = {
      env: {
        log: (pointer, length) => {
          // Read "length" bytes from Wasm memory, starting at "pointer"
          const memory = new Uint8Array(wasm.memory.buffer, pointer, length);
          const text = new TextDecoder().decode(memory); // bytes -> string
          document.getElementById('hello-result').textContent = text;
        },
      },
    };

    // 3. Compile and instantiate the module
    const { instance } = await WebAssembly.instantiate(bytes, imports);
    wasm = instance.exports; // memory, hello, add

    // 4. Enable the buttons and show load info
    const loadTime = (performance.now() - startTime).toFixed(2);
    enableButton('btn-hello', 'Say Hello');
    enableButton('btn-add', 'Add with Wasm');
    document.getElementById('hello-result').textContent =
      `Module loaded (${bytes.byteLength} bytes) in ${loadTime} ms`;
  } catch (err) {
    document.getElementById('hello-result').textContent = 'Error loading Wasm: ' + err.message;
  }
}

function enableButton(id, text) {
  const button = document.getElementById(id);
  button.disabled = false;
  button.textContent = text;
}

// ---------- Part 2: call the Wasm functions ----------

// Calls hello(); Wasm will call our "log" import with the text.
function sayHello() {
  wasm.hello();
}

// Reads the inputs and calls the Wasm "add" function.
function addWithWasm() {
  const a = parseInt(document.getElementById('num-a').value, 10) || 0;
  const b = parseInt(document.getElementById('num-b').value, 10) || 0;
  const result = wasm.add(a, b); // <- this runs inside WebAssembly
  document.getElementById('add-result').textContent =
    `${a} + ${b} = ${result}  (calculated by WebAssembly)`;
}

// ---------- Part 3: Wasm on the server ----------

async function callBackend() {
  const output = document.getElementById('backend-result');
  output.textContent = 'Calling backend...';
  try {
    const response = await fetch('/api/hello');
    const data = await response.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: backend not reachable. Is the server running?';
  }
}

// ---------- Wire up the buttons ----------
document.getElementById('btn-hello').addEventListener('click', sayHello);
document.getElementById('btn-add').addEventListener('click', addWithWasm);
document.getElementById('btn-backend').addEventListener('click', callBackend);

// Load the Wasm module as soon as the page opens
loadWasm();
