# Comparison

## 1. WebAssembly vs JavaScript

WebAssembly does **not** replace JavaScript. JavaScript controls the page (DOM, events, fetch), and WebAssembly does the heavy computation.

| Aspect | JavaScript | WebAssembly |
|--------|------------|-------------|
| **Format** | Text (source code) | Binary (compiled bytecode) |
| **Typing** | Dynamic | Static: only numbers (i32, i64, f32, f64) |
| **Languages** | JavaScript / TypeScript | C, C++, Rust, Go, AssemblyScript, WAT... |
| **Performance** | Fast thanks to JIT, but less predictable | Near-native and predictable |
| **DOM access** | Direct | None: it must go through JavaScript |
| **Text / strings** | Native | Manual: pointer + length in linear memory |
| **Best for** | UI, events, business logic | Games, image/video, CAD, cryptography, porting existing code |

### In our POC

| Task | Who does it |
|------|-------------|
| Download `hello.wasm` and handle the buttons | JavaScript |
| Store the "Hello World" text and decide what to send | WebAssembly |
| Turn bytes into a string and show it on the page | JavaScript (`TextDecoder`) |
| Calculate `add(5, 7)` | WebAssembly |

## 2. WebAssembly vs Docker (based on our two POCs)

Both projects follow the same structure (front, back, docs, CI, three branches), so they are easy to compare.

| Aspect | Docker POC | WebAssembly POC |
|--------|------------|-----------------|
| **Main goal** | Package and run the whole app the same way everywhere | Run fast, compiled, portable code |
| **Where it runs** | Docker Engine on the host OS | Browser and Node.js (any Wasm runtime) |
| **Unit of work** | Container (from an image) | Module (`.wasm` file) |
| **What it does** | Node.js API + Nginx in two containers | `hello()` sends text, `add()` adds numbers |
| **Build output** | Two images, around 50-130 MB each | One file: `hello.wasm` (**131 bytes**) |
| **Startup** | Seconds | Milliseconds (load time shown on the page) |
| **Requirements to run** | Docker Desktop | Only Node.js 20 and a browser |
| **Isolation** | Linux namespaces and cgroups | Memory sandbox inside the runtime |
| **Portability** | Same image on any machine with Docker | Same `.wasm` file in browser and server |
| **Created by** | Solomon Hykes / dotCloud (2013) | Mozilla, Google, Microsoft, Apple via W3C (2015-2017) |
| **Standard** | OCI (Open Container Initiative) | W3C Recommendation (2019) |

*Image sizes are approximate and depend on the version.*

## Conclusion

- **JavaScript + WebAssembly** work as a team: JS handles the page and Wasm handles the computation.
- **Docker** answers *"how do I deliver and run my whole application everywhere?"*, and **WebAssembly** answers *"how do I run fast, portable compiled code safely?"*
- Both ideas meet in the concept of **portability**: Docker makes an **environment** portable, and WebAssembly makes **code** portable. They complement each other; for example, the Docker POC serves a `.wasm` file from its Nginx container.
