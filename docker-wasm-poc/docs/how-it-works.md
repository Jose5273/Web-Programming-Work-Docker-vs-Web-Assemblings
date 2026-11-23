# How it works

## 1. Architecture

```
                 Your computer (host)
 ┌───────────────────────────────────────────────────────┐
 │  Browser ── http://localhost:8080 ──┐                 │
 │                                     │                 │
 │   Docker network (created by docker compose)          │
 │   ┌─────────────────────────────────▼──────────────┐  │
 │   │  front container (Nginx)        port 80        │  │
 │   │  - serves index.html, main.js, style.css       │  │
 │   │  - serves wasm/add.wasm                        │  │
 │   │  - /api/*  ──proxy──┐                          │  │
 │   └─────────────────────┼──────────────────────────┘  │
 │   ┌─────────────────────▼──────────────────────────┐  │
 │   │  back container (Node.js)       port 3000      │  │
 │   │  - GET /api/hello   - GET /api/health          │  │
 │   └────────────────────────────────────────────────┘  │
 └───────────────────────────────────────────────────────┘
```

- Only the **front** container is published to the host (port `8080`).
- The **back** container is private. The frontend reaches it through Docker's internal network using the service name `back`.

## 2. Step by step: the Docker POC

1. `docker compose up --build` reads `docker-compose.yml`.
2. Docker builds two **images** from `back/Dockerfile` and `front/Dockerfile`.
3. Docker creates a private **network** and starts the `back` container.
4. Docker runs the **healthcheck** (`/api/health`). When the backend is healthy, it starts the `front` container.
5. The browser opens `http://localhost:8080`, and Nginx returns `index.html`.
6. When you press **Call backend**, `main.js` calls `/api/hello`.
7. Nginx forwards the request to `http://back:3000/api/hello`.
8. The backend answers with JSON. The `container` field is the container ID, which proves the code runs inside Docker.

## 3. Step by step: the WebAssembly POC

1. `add.wat` is the source code in WebAssembly Text Format. It defines a function `add(a, b)`.
2. It was compiled to `add.wasm`, a **binary** file of only 41 bytes.
3. When the page loads, `main.js`:
   - downloads `wasm/add.wasm` with `fetch`
   - compiles and instantiates it with `WebAssembly.instantiate()`
   - saves the exported function `instance.exports.add`
4. When you press **Add with Wasm**, JavaScript calls `add(a, b)`. The calculation runs inside the WebAssembly virtual machine of the browser, not in JavaScript.

```
add.wat  --(wat2wasm)-->  add.wasm  --(fetch)-->  browser  --(instantiate)-->  add(5, 7) = 12
```

## 4. Branching strategy

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

## 5. CI pipeline (GitHub Actions)

File: `.github/workflows/ci.yml`. It runs on every **push** or **pull request** to `main`, `qa` or `dev`.

| Job | What it does |
|-----|--------------|
| **1. Test backend and WebAssembly** | Installs Node.js 20, runs the backend unit tests and the Wasm test (`add(5, 7) === 12`). |
| **2. Build and test Docker containers** | Runs `docker compose up --build`, then uses `curl` to check the page, the API through the proxy, and that `add.wasm` is served as `application/wasm`. |
| **3. Environment summary** | Shows which environment the branch represents (main = production, qa = testing, dev = development). |

Each job only runs if the previous one passed (`needs:`). You can see the results in the **Actions** tab of the GitHub repository.
