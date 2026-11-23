// =============================================================
// WebAssembly test: loads hello.wasm with Node.js and checks it.
// Node.js runs WebAssembly natively, just like the browser.
// Run with: node front/wasm/test-wasm.js
// GitHub Actions runs this test on every push to main, qa and dev.
// =============================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Read the compiled binary module
const bytes = fs.readFileSync(path.join(__dirname, 'hello.wasm'));

let instance;        // the running Wasm module
let printedText = ''; // text that Wasm sends to JavaScript

// 2. Functions that JavaScript gives to Wasm (the "imports")
const imports = {
  env: {
    // Wasm calls log(pointer, length); we read those bytes from its memory
    log: (pointer, length) => {
      const memory = new Uint8Array(instance.exports.memory.buffer, pointer, length);
      printedText = new TextDecoder().decode(memory);
    },
  },
};

// 3. Compile, instantiate and test
WebAssembly.instantiate(bytes, imports)
  .then((result) => {
    instance = result.instance;

    // Test 1: the "hello" function sends the Hello World text
    instance.exports.hello();
    assert.strictEqual(printedText, 'Hello World from WebAssembly!');

    // Test 2: the "add" function returns the right sums
    assert.strictEqual(instance.exports.add(5, 7), 12);
    assert.strictEqual(instance.exports.add(-3, 3), 0);

    console.log('WebAssembly tests passed:', printedText, '| add(5, 7) =', instance.exports.add(5, 7));
  })
  .catch((err) => {
    console.error('WebAssembly test failed:', err.message);
    process.exit(1); // a non-zero exit code makes the CI pipeline fail
  });
