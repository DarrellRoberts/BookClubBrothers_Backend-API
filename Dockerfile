# --- STAGE 1: Build ---
FROM node:20-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Force a clean build by deleting any potential local 'dist' that got copied
RUN rm -rf dist && npm run build

# --- STAGE 2: Run ---
FROM node:20-slim
WORKDIR /usr/src/app
# Copy the production dependencies and the FRESHLY built dist
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/dist ./dist

# If you use ENV variables, they should be referenced here or in the GCP Dashboard
EXPOSE 5000
CMD [ "node", "dist/server.js" ]