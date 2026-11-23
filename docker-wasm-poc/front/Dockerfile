# =============================================================
# Frontend image: static files served by Nginx
# =============================================================

# 1. Base image: Nginx web server on Alpine Linux
FROM nginx:alpine

# 2. Replace the default Nginx config with ours (adds the /api proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Copy the web page files
COPY index.html main.js style.css /usr/share/nginx/html/

# 4. Copy the compiled WebAssembly module
COPY wasm/add.wasm /usr/share/nginx/html/wasm/add.wasm

# 5. Nginx listens on port 80
EXPOSE 80
