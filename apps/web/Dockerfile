# apps/web/Dockerfile

# ----- Base Image -----
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# ----- Builder Stage -----
FROM base AS builder

# Install pnpm globally
RUN npm install -g pnpm@8.15.4

# Set PNPM_HOME manually to avoid global install issues
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Manually run pnpm setup to fix bin path issue
RUN pnpm setup

# Install Turbo globally
RUN pnpm add -g turbo@2.4.0

# Copy all monorepo files
COPY . .

# 🔥 Turbo Prune - Only keep required files for `web` workspace
RUN turbo prune web --docker

# ----- Dependencies Stage -----
FROM base AS installer

# Set working directory
WORKDIR /app

# Copy pruned dependency files
COPY --from=builder /app/out/json/ .

# Install only necessary dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy the full pruned repo for building
COPY --from=builder /app/out/full/ .

# 🔥 Build Next.js App
RUN pnpm exec turbo run build --filter=web

# ----- Runner Stage -----
FROM base AS runner

# Set working directory
WORKDIR /app

# Ensure non-root execution
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://medflow.cloud
ENV NEXTAUTH_URL=https://medflow.cloud
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV MONGODB_URI=${MONGODB_URI}

# Copy built artifacts
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Expose the port
EXPOSE 3001

# Start the app
CMD node apps/web/server.js