# --- STAGE 1: Build ---
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
# Install ALL dependencies (including typescript and @types)
RUN npm install

COPY . .

# Run the typescript compiler (tsc)
# This assumes you have a "build" script in package.json (usually "tsc")
RUN npm run build

# --- STAGE 2: Run ---
FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./
# Install only production dependencies (skips devDependencies)
RUN npm install --omit=dev

# Copy the compiled JS from the builder stage
# Assuming your tsconfig.json has "outDir": "./dist"
COPY --from=builder /usr/src/app/dist ./dist

# Copy any other necessary files (like your .env template if needed)
# COPY .env.example .env

EXPOSE 5000

# Run the compiled code from the dist folder
CMD [ "node", "dist/server.js" ]