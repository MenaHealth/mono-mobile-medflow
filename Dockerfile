# monorepo/Dockerfile

# ----- Stage 1: Build the Next.js App -----
FROM node:18-bullseye AS builder
WORKDIR /app

# Copy root package files (if needed for workspaces)
COPY package*.json ./

# Copy the workspace folders (apps and packages)
COPY apps/web ./apps/web
COPY packages ./packages

# Change to the web app folder
WORKDIR /app/apps/web

# (Optional) If you don't need the .env file, comment this out:
# COPY .env ./

# Install dependencies with workspace awareness
RUN npm install

# Build the Next.js app
RUN npm run build

# ----- Stage 2: Create the Production Image -----
FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy built files and necessary assets from the builder stage
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package*.json ./
# If you removed the .env copy above, remove this line too:
# COPY --from=builder /app/apps/web/.env ./

# Install only production dependencies
RUN npm install --only=production

EXPOSE 3001
CMD ["npm", "start"]