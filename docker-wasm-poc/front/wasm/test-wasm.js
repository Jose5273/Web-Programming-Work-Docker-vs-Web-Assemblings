// =============================================================
// WebAssembly test: loads add.wasm with Node.js and checks results.
// Node.js supports WebAssembly natively, just like the browser.
// Run with: node front/wasm/test-wasm.js
// GitHub Actions runs this test on every push to main, qa and dev.
// =============================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Read the compiled binary module
const bytes = fs.readFileSync(path.join(__dirname, 'add.wasm'));

// 2. Compile and instantiate it
WebAssembly.instantiate(bytes)
  .then(({ instance }) => {
    const { add } = instance.exports;

    // 3. Check that the Wasm function returns the right results
    assert.strictEqual(add(5, 7), 12);
    assert.strictEqual(add(-3, 3), 0);
    assert.strictEqual(add(100, 250), 350);

    console.log('WebAssembly test passed: add(5, 7) =', add(5, 7));
  })
  .catch((err) => {
    console.error('WebAssembly test failed:', err.message);
    process.exit(1); // a non-zero exit code makes the CI pipeline fail
  });
