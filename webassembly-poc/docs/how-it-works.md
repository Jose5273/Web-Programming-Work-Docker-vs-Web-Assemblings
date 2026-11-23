# How it works

## 1. Architecture

```
                    Your computer
 ┌────────────────────────────────────────────────────────┐
 │                                                        │
 │  Browser ── http://localhost:3000 ──┐                  │
 │  ┌──────────────────────────┐       │                  │
 │  │ main.js                  │       ▼                  │
 │  │  └─ hello.wasm (browser) │   Node.js server         │
 │  │      hello()  add()      │   back/server.js         │
 │  └──────────────────────────┘    ├─ serves front/      │
 │                                  └─ /api/hello         │
 │                                      └─ hello.wasm     │
 │                                         (server side)  │
 └────────────────────────────────────────────────────────┘
```

The **same binary file** (`front/wasm/hello.wasm`) runs in both places. This is one of the main ideas of WebAssembly: **portable** code that runs in any Wasm runtime.

## 2. Inside the module (`hello.wat`)

| Part | What it does |
|------|--------------|
| `(import "env" "log" ...)` | Wasm **receives** a function from JavaScript. Wasm cannot print text by itself, so it asks JS to do it. |
| `(memory (export "memory") 1)` | One page (64 KB) of **linear memory**, shared with JavaScript. |
| `(data (i32.const 0) "Hello World from WebAssembly!")` | Writes the text into memory at address 0 (29 bytes). |
| `(func (export "hello") ...)` | Calls `log(0, 29)`: "read 29 bytes starting at address 0". |
| `(func (export "add") ...)` | Adds two 32-bit integers using the stack: `local.get`, `local.get`, `i32.add`. |

WebAssembly only understands **numbers** (i32, i64, f32, f64). To pass text, it shares a **pointer** (memory position) and a **length**, and JavaScript decodes those bytes into a string with `TextDecoder`.

## 3. Step by step in the browser

1. `index.html` loads `main.js`.
2. `main.js` downloads `wasm/hello.wasm` with `fetch()` and gets the bytes with `arrayBuffer()`.
3. `WebAssembly.instantiate(bytes, imports)` compiles the module and connects the `log` import.
4. The exports (`memory`, `hello`, `add`) are now available to JavaScript.
5. **Say Hello** → `wasm.hello()` → Wasm calls `log(0, 29)` → JS reads the memory → the text appears on the page.
6. **Add with Wasm** → `wasm.add(5, 7)` → returns `12`.

```
hello.wat --(wat2wasm)--> hello.wasm --(fetch)--> browser --(instantiate)--> hello() / add()
```

## 4. Step by step on the server

1. `node back/server.js` starts an HTTP server on port 3000.
2. It serves the files of `front/`. `.wasm` files are sent with the MIME type `application/wasm`, which browsers require.
3. On `GET /api/hello`, the server reads `hello.wasm` from disk, instantiates it with the same `log` import, calls `hello()` and `add(5, 7)`, and answers:

```json
{
  "message": "Hello World from WebAssembly!",
  "sum": 12,
  "runtime": "Node.js v20.x (server side)"
}
```

## 5. Branching strategy

```
dev  ──●──●──●──┐            (developers work here)
                │ PR
qa   ───────────●──●──┐      (testing / validation)
                      │ PR
main ─────────────────●──    (stable / production)
```

| Branch | Purpose |
|--------|---------|
| `dev`  | New features and daily work |
| `qa`   | Code under test before release |
| `main` | Approved, stable code |

Changes move forward with **pull requests**: `dev` → `qa` → `main`.

## 6. CI pipeline (GitHub Actions)

File: `.github/workflows/ci.yml`. It runs on every **push** or **pull request** to `main`, `qa` or `dev`.

| Job | What it does |
|-----|--------------|
| **1. Test WebAssembly module and backend** | Installs Node.js 20, checks that `hello()` returns the Hello World text and that `add(5, 7) === 12`, then runs the backend tests. |
| **2. Start server and smoke-test** | Starts the real server and uses `curl` to check the page, the `/api/hello` endpoint and that `hello.wasm` is served as `application/wasm`. |
| **3. Environment summary** | Shows which environment the branch represents (main = production, qa = testing, dev = development). |

Each job only runs if the previous one passed (`needs:`). The results are in the **Actions** tab of the GitHub repository.
