#medflow/Dockerfile
# Stage 1: Build the Next.js app
FROM node:18-bullseye AS builder

# Set working directory
WORKDIR /app

# Copy the package.json, package-lock.json, and lib directory
COPY package.json package-lock.json ./
COPY lib ./lib

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the Next.js app
FROM node:18-alpine

# Set runtime environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib

# Install only production dependencies
RUN npm install --only=production

# Start the Next.js app
CMD ["npm", "start"]