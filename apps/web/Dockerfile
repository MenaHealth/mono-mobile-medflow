# apps/web/Dockerfile

# apps/web/Dockerfile

# Stage 1: Setup base
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS builder
RUN npm install -g pnpm@8.15.4 turbo@2.4.0

# Copy root package.json and lockfile
COPY package.json pnpm-lock.yaml* ./

# Copy the web app package.json
COPY apps/web/package.json ./apps/web/

# Copy Turbo config
COPY turbo.json ./

# Prune the workspace for the web app
RUN turbo prune web --docker

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 3: Build the application
FROM base AS installer
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm@8.15.4
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json .
RUN pnpm run build --filter=web

# Stage 4: Run the application
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy built application
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "apps/web/server.js"]