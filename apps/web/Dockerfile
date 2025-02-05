# apps/web/Dockerfile

# ----- Stage 1: Build the Next.js App -----
FROM node:18-bullseye AS builder

# Set working directory
WORKDIR /app

# Copy the root package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy all workspace packages and apps
COPY packages ./packages
COPY apps/web ./apps/web

# Copy the lib folder inside apps/web
COPY apps/web/lib ./apps/web/lib

# Install all dependencies
RUN npm install

# Build the Next.js app
RUN npm run build


# ----- Stage 2: Run the Next.js App -----
FROM node:18-alpine

# Set production environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built artifacts and necessary files from the builder stage
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/lib ./apps/web/lib

# Install only production dependencies
RUN npm install --only=production

# Expose the port (set here to 3001)
EXPOSE 3001

# Start the Next.js app
CMD ["npm", "start"]