# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package lock and configurations
COPY package*.json ./

# Install all dependencies (including devDependencies for compiler/bundler)
RUN npm ci

# Copy codebase
COPY . .

# Declare build-time argument so it is available during RUN npm run build.
# Pass it with: docker build --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_...
# docker-compose passes it automatically via build.args when set in the shell/.env
ARG VITE_CLERK_PUBLISHABLE_KEY
# Promote to environment variable so Vite (and dotenv-cli) can read it
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Run build (Vite client to dist/public, Express backend bundled to dist/index.js)
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5008

# Copy package lock and configurations
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built bundles from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads folder for S3 local fallback storage
RUN mkdir -p uploads

EXPOSE 5008

CMD ["npm", "start"]
