;; =============================================================
;; WebAssembly Text Format (WAT): the human-readable source code.
;; It is compiled to the binary file hello.wasm (131 bytes).
;;
;; To recompile (optional), install WABT and run:
;;   wat2wasm hello.wat -o hello.wasm
;; =============================================================

(module
  ;; 1. IMPORT: a function that JavaScript gives to WebAssembly.
  ;;    Wasm cannot print text by itself, so it asks JS to do it.
  ;;    log(pointer, length) -> JS reads the text from Wasm memory.
  (import "env" "log" (func $log (param i32 i32)))

  ;; 2. MEMORY: one page (64 KB) of linear memory.
  ;;    It is exported so JavaScript can read the text stored in it.
  (memory (export "memory") 1)

  ;; 3. DATA: write the text into memory, starting at address 0.
  ;;    "Hello World from WebAssembly!" has 29 characters (bytes).
  (data (i32.const 0) "Hello World from WebAssembly!")

  ;; 4. FUNCTION "hello": sends the text to JavaScript.
  (func (export "hello")
    i32.const 0     ;; pointer: where the text starts in memory
    i32.const 29    ;; length: how many bytes to read
    call $log       ;; call the JavaScript function
  )

  ;; 5. FUNCTION "add": adds two 32-bit integers and returns the result.
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    local.get $a    ;; push a onto the stack
    local.get $b    ;; push b onto the stack
    i32.add         ;; pop both, add them, push the result
  )
)
