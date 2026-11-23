# WebAssembly (Wasm)

## What is it?

WebAssembly is a low-level **binary format** that browsers can run at near-native speed. It lets us bring code written in languages like C, C++, Rust or Go to the web. It does not replace JavaScript; it works **together** with it.

## How does it work?

1. You write code in a language such as C, C++, Rust or WAT (WebAssembly Text Format).
2. You compile it to a `.wasm` file (bytecode) using tools like Emscripten, wasm-pack or wat2wasm.
3. JavaScript downloads that file and calls its exported functions.
4. The browser runs it inside a secure **sandbox**, with no direct access to the system.

```
C / C++ / Rust / WAT --(compiler)--> .wasm --(JavaScript loads it)--> Browser runs it
```

## Where can we use it?

- High-performance tasks in the browser: games, image and video editing, CAD, cryptography, emulators
- Porting existing desktop applications to the web
- Outside the browser: serverless and edge computing (Cloudflare Workers, Fastly Compute) using **WASI**

## Who implemented it?

- **Figma:** its design editor is written in C++ and compiled to Wasm; adopting it reduced load time about 3 times.
- **Autodesk (AutoCAD Web):** brought decades-old C++ AutoCAD code to the browser.
- **Adobe (Photoshop on the web):** runs Photoshop in the browser using Wasm and Emscripten.
- **Google Earth:** its web version works across browsers thanks to Wasm.
- **Unity and Unreal Engine:** export 3D games to the browser with WebAssembly.
- **Amazon Prime Video and Disney+:** use Wasm in parts of their apps for better performance on different devices.
- **Zoom:** its web client uses Wasm for audio and video processing.
- **Cloudflare Workers, Fastly Compute and Shopify Functions:** run Wasm on servers and at the edge.

## Who created it?

WebAssembly has no single creator. It was a **joint effort** of the companies that build web browsers.

- **Background:**
  - **Mozilla** created **asm.js** in 2013, a highly optimizable subset of JavaScript. It was developed by **Alon Zakai** (creator of **Emscripten**), **Luke Wagner** and **David Herman**.
  - **Google** had its own technology, **Native Client (NaCl / PNaCl)**, which only worked in Chrome.
- **Birth:** in **June 2015**, **Mozilla, Google, Microsoft and Apple** announced they would work together on a common standard: WebAssembly. Luke Wagner (Mozilla) is considered one of its main drivers.
- **Specification:** **Andreas Rossberg** (Google) wrote much of the formal specification, and **Ben Titzer** (Google, V8 engine) also took an active part.

**Timeline:**

| Year | Event |
|------|-------|
| 2015 | Announcement. The **WebAssembly Community Group** is created inside the **W3C**. |
| 2017 | The first version (MVP) ships in **Firefox, Chrome, Edge and Safari** at almost the same time. |
| 2019 | The W3C makes it an **official standard**: the fourth native language of the web, after HTML, CSS and JavaScript. |
| 2019 | Mozilla, Fastly, Intel and Red Hat found the **Bytecode Alliance** to run Wasm outside the browser with **WASI**. |

## Our POC

See `front/wasm/`. The module `hello.wat` is compiled to the 131-byte binary `hello.wasm`. It stores the text "Hello World from WebAssembly!" in its memory, sends it to JavaScript through an imported `log` function, and exports an `add` function. The same file runs in the browser (`front/main.js`) and on the server (`back/server.js`). Full explanation: [how-it-works.md](how-it-works.md).
