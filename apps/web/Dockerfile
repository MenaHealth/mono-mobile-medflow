# apps/web/Dockerfile

# ----- Stage 1: Build the Next.js App -----
FROM node:18-bullseye AS builder

# Install pnpm manually instead of relying on Corepack
RUN npm install -g pnpm@8.15.4

# Set working directory
WORKDIR /app

# Copy the root package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Copy all workspace packages
COPY packages ./packages
COPY apps/web ./apps/web

# Ensure the `lib/` folder inside `apps/web/` is copied
COPY apps/web/lib ./apps/web/lib

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Build the Next.js app
RUN pnpm exec turbo run build --filter=apps/web

# ----- Stage 2: Run the Next.js App -----
FROM node:18-alpine

# Install pnpm manually instead of relying on Corepack
RUN npm install -g pnpm@8.15.4

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