# =============================================================
# Backend image: Node.js API
# =============================================================

# 1. Base image: official Node.js 20 on Alpine Linux (very small)
FROM node:20-alpine

# 2. Working folder inside the container
WORKDIR /app

# 3. Copy only the files the app needs to run
COPY package.json ./
COPY server.js ./

# 4. Default port for the API
ENV PORT=3000

# 5. Document that the container listens on port 3000
EXPOSE 3000

# 6. Security good practice: do not run as root
USER node

# 7. Command executed when the container starts
CMD ["node", "server.js"]
