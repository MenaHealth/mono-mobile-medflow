# apps/web/Dockerfile

# ----- Stage 1: Build the Next.js App -----
FROM node:18-bullseye AS builder

# Enable corepack for pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy the root package.json and package-lock.json
COPY package.json pnpm-lock.yaml ./

# Copy all workspace packages
COPY packages ./packages
COPY apps/web ./apps/web

# Ensure the `lib/` folder inside `apps/web/` is copied
COPY apps/web/lib ./apps/web/lib

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Build the Next.js app
RUN pnpm run build


# ----- Stage 2: Run the Next.js App -----
FROM node:18-alpine

# Enable corepack for pnpm
RUN corepack enable

# Set production environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built artifacts and necessary files from the builder stage
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/lib ./apps/web/lib

# Install only production dependencies using pnpm
RUN pnpm install --prod --frozen-lockfile

# Expose the port (set here to 3001)
EXPOSE 3001

# Start the Next.js app
CMD ["pnpm", "start"]