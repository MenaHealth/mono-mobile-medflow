# apps/web/Dockerfile

# apps/web/Dockerfile

# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8.15.4

# Set working directory
WORKDIR /app

# Copy the root package.json and pnpm-lock.yaml (if it exists)
COPY package.json pnpm-lock.yaml* ./

# Copy the app's package.json
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN pnpm run build --filter=web

# Stage 2: Run the Next.js app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built artifacts and necessary files from the builder stage
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["node", "apps/web/.next/standalone/apps/web/server.js"]