# apps/web/Dockerfile

# ----- Stage 1: Build the Next.js App -----
FROM node:18-bullseye AS builder

# Set working directory
WORKDIR /app

# Copy the package.json (and only that if package-lock.json is not available)
COPY package.json ./

# Copy the lib directory (if you have one)
COPY lib ./lib

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build


# ----- Stage 2: Run the Next.js App -----
FROM node:18-alpine

# Set production environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built artifacts and necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib

# Install only production dependencies
RUN npm install --only=production

# Expose the port (set here to 3001)
EXPOSE 3001

# Start the Next.js app
CMD ["npm", "start"]