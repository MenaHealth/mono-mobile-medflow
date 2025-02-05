# apps/web/Dockerfile

# ----- Stage 1: Build the Next.js App -----
FROM node:18-bullseye AS builder

# Install pnpm manually
RUN npm install -g pnpm@8.15.4

# Set working directory
WORKDIR /app

# Copy the root package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Copy all workspace packages
COPY packages ./packages
COPY apps/web ./apps/web
COPY turbo.json pnpm-workspace.yaml ./

# Ensure the `lib/` folder inside `apps/web/` is copied
COPY apps/web/lib ./apps/web/lib

# 🔥 Inject environment variables at build time 🔥
ARG MONGODB_URI
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Build the Next.js app
RUN pnpm exec turbo run build --filter=web

# ----- Stage 2: Run the Next.js App -----
FROM node:18-alpine

# Install pnpm manually
RUN npm install -g pnpm@8.15.4

# Set runtime environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built artifacts and necessary files from the builder stage
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/lib ./apps/web/lib

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Expose the port
EXPOSE 3001

# Start the Next.js app
CMD ["pnpm", "start"]