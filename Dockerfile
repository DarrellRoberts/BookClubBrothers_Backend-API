# --- STAGE 1: Build ---
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# --- STAGE 2: Run ---
FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 5000

CMD [ "node", "dist/server.js" ]