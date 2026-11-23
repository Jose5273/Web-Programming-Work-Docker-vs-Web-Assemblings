# Hello World: WebAssembly POC

Proof of Concept (POC) for the **Web Programming** course.

A simple "Hello World" built with **WebAssembly (Wasm)**. One compiled file, `hello.wasm`, runs in **two places**:

- **In the browser:** the page loads the module, shows its "Hello World" message and adds numbers with it.
- **On the server:** the Node.js backend runs the same file and returns the result as JSON.

---

## Project structure

```
webassembly-poc/
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions pipeline (tests + smoke test)
├── back/                     # Backend: Node.js server (no dependencies)
│   ├── server.js             # Serves the frontend and runs hello.wasm (/api/hello)
│   ├── package.json
│   └── test/
│       └── server.test.js    # Backend tests
├── front/                    # Frontend: HTML + JS + WebAssembly
│   ├── index.html            # Web page
│   ├── main.js               # Loads hello.wasm and calls its functions
│   ├── style.css
│   └── wasm/
│       ├── hello.wat         # Wasm source code (text format)
│       ├── hello.wasm        # Compiled Wasm binary (131 bytes)
│       └── test-wasm.js      # Wasm module test
├── docs/                     # Documentation
│   ├── how-it-works.md       # Architecture, branches and CI/CD
│   ├── webassembly.md        # WebAssembly research
│   └── comparison.md         # WebAssembly vs JavaScript, and vs Docker
└── README.md
```

## Quick start

**Requirements:** [Node.js 20](https://nodejs.org/) or newer. Nothing else to install.

```bash
# 1. Start the server
node back/server.js

# 2. Open the app in the browser
#    http://localhost:3000

# 3. Stop the server with Ctrl + C
```

On the page:
1. **Say Hello**: calls the Wasm function `hello()`, which sends "Hello World from WebAssembly!" to JavaScript.
2. **Add with Wasm**: the sum of the two numbers is calculated by the Wasm function `add()`.
3. **Call backend**: the server runs the same `hello.wasm` and returns the message and the sum as JSON.

> Note: you cannot open `index.html` by double-clicking it. Browsers block `fetch()` of `.wasm` files from `file://`, so the page must be served by the server.

## Run the tests

```bash
node front/wasm/test-wasm.js           # WebAssembly module test
node --test back/test/server.test.js   # backend tests
```

## Branches

| Branch | Purpose | Environment |
|--------|---------|-------------|
| `dev`  | Daily development, new features | Development |
| `qa`   | Testing before release | Testing (QA) |
| `main` | Stable, approved code | Production |

Workflow: `dev` → pull request → `qa` → pull request → `main`.
GitHub Actions runs the CI pipeline on every push and pull request to these three branches.

## Documentation

- [How it works](docs/how-it-works.md)
- [WebAssembly: what, how, where, who](docs/webassembly.md)
- [Comparison](docs/comparison.md)
