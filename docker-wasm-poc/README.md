# Hello World: Docker + WebAssembly POC

Proof of Concept (POC) for the **Web Programming** course.
It shows two technologies working together in a simple "Hello World" project:

- **Docker** runs the whole application (frontend + backend) in containers.
- **WebAssembly (Wasm)** runs a compiled function (`add`) inside the browser.

---

## Project structure

```
docker-wasm-poc/
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions pipeline (tests + Docker build)
├── back/                     # Backend: Node.js REST API
│   ├── server.js             # "Hello World" API (no dependencies)
│   ├── package.json
│   ├── Dockerfile            # Backend container image
│   └── test/
│       └── server.test.js    # Unit tests
├── front/                    # Frontend: HTML + JS + WebAssembly
│   ├── index.html            # Web page
│   ├── main.js               # Calls the API and loads the Wasm module
│   ├── style.css
│   ├── nginx.conf            # Web server + reverse proxy to the backend
│   ├── Dockerfile            # Frontend container image
│   └── wasm/
│       ├── add.wat           # Wasm source code (text format)
│       ├── add.wasm          # Compiled Wasm binary (41 bytes)
│       └── test-wasm.js      # Wasm test
├── docs/                     # Documentation
│   ├── how-it-works.md       # Architecture, branches and CI/CD
│   ├── docker.md             # Docker research
│   ├── webassembly.md        # WebAssembly research
│   └── comparison.md         # Docker vs WebAssembly comparison
├── docker-compose.yml        # Starts everything with one command
└── README.md
```

## Quick start

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
# 1. Build the images and start both containers
docker compose up --build

# 2. Open the app in the browser
#    http://localhost:8080

# 3. Stop everything
docker compose down
```

On the page:
1. **Call backend**: the frontend calls `/api/hello` and shows a JSON response from the backend container, including the container ID.
2. **Add with Wasm**: the sum of the two numbers is calculated by the `add.wasm` module.

## Run the tests locally (optional)

Requires Node.js 20 or newer.

```bash
node --test back/test/server.test.js   # backend tests
node front/wasm/test-wasm.js           # WebAssembly test
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
- [Docker](docs/docker.md)
- [WebAssembly](docs/webassembly.md)
- [Comparison: Docker vs WebAssembly](docs/comparison.md)
