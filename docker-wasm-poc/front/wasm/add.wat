;; =============================================================
;; WebAssembly Text Format (WAT): the human-readable source code.
;; It is compiled to the binary file add.wasm, which the browser runs.
;;
;; To recompile (optional), install WABT and run:
;;   wat2wasm add.wat -o add.wasm
;; =============================================================

(module
  ;; Function "add": receives two 32-bit integers and returns their sum.
  ;; (export "add") makes it visible to JavaScript.
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    local.get $a   ;; push the first parameter onto the stack
    local.get $b   ;; push the second parameter onto the stack
    i32.add        ;; pop both values, add them, push the result
  )
)
