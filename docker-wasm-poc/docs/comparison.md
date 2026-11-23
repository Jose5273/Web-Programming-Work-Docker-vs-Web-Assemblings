# Comparison: Docker vs WebAssembly

Docker and WebAssembly are **not competitors**. They solve different problems, and this POC uses them **together**: Docker packages and runs the application, and WebAssembly runs fast compiled code inside the browser.

## General comparison

| Aspect | Docker | WebAssembly |
|--------|--------|-------------|
| **What it is** | Containerization platform | Binary instruction format |
| **Main goal** | Run apps the same way on any machine | Run compiled code fast and safely in the browser |
| **Where it runs** | Server / developer machine (host OS) | Browser (also servers with WASI) |
| **Unit of work** | Container (from an image) | Module (`.wasm` file) |
| **Isolation** | Linux namespaces and cgroups | Memory sandbox inside the runtime |
| **Languages** | Any language (it packages the whole environment) | C, C++, Rust, Go, AssemblyScript, WAT... |
| **Typical size** | Megabytes (includes a base OS layer) | Bytes to megabytes (only the compiled code) |
| **Startup time** | Seconds | Milliseconds |
| **Created by** | Solomon Hykes / dotCloud (2013) | Mozilla, Google, Microsoft, Apple via W3C (2015-2017) |
| **Standard** | OCI (Open Container Initiative) | W3C Recommendation (2019) |

## Comparison based on our POCs

| Aspect | Docker POC | WebAssembly POC |
|--------|------------|-----------------|
| **What it does** | Runs a Node.js API and an Nginx web server in two containers | Adds two numbers with a compiled `add` function |
| **Source files** | `back/Dockerfile`, `front/Dockerfile`, `docker-compose.yml` | `front/wasm/add.wat` |
| **Build step** | `docker compose up --build` builds two images | `wat2wasm add.wat -o add.wasm` (already compiled) |
| **Output** | Two images: `node:20-alpine` (~130 MB) and `nginx:alpine` (~50 MB) | One file: `add.wasm` (**41 bytes**) |
| **How it runs** | Docker Engine starts the containers | The browser loads it with `WebAssembly.instantiate()` |
| **Startup** | A few seconds (with healthcheck) | Less than a few milliseconds (time shown on the page) |
| **Communication** | HTTP: front → Nginx proxy → back (`/api/hello`) | Direct function call from JavaScript: `add(5, 7)` |
| **Proof it works** | The JSON response includes the container ID | Page shows `5 + 7 = 12 (calculated by WebAssembly)` |
| **How CI tests it** | Builds and starts containers, checks them with `curl` | Loads `add.wasm` in Node.js and checks `add(5, 7) === 12` |

*Image sizes are approximate and depend on the version.*

## Conclusion

- **Docker** answers the question: *"How do I deliver and run my whole application the same way everywhere?"*
- **WebAssembly** answers the question: *"How do I run fast, compiled code safely inside the browser?"*

In this project, Docker even **serves** the WebAssembly file: the Nginx container delivers `add.wasm` to the browser. This shows that both technologies complement each other in modern web development.
