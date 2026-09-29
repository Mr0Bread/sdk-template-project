# Pinned to the exact Node LTS patch, same as the frontend image.
FROM node:24.21.0-alpine

WORKDIR /app

# Dependencies first so this layer is cached until package*.json change.
COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

USER node

EXPOSE 8000

# Run tsx directly (not via `npm start`) so SIGTERM reaches the process.
CMD ["node_modules/.bin/tsx", "src/main.ts"]
