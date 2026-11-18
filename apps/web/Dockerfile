FROM node:20-alpine AS builder
WORKDIR /app

# Copy root package files first (for workspace resolution)
COPY ../../package.json ../../package-lock.json ../
COPY ./package.json ./package-lock.json ./

# Install dependencies at root level to resolve workspace links
RUN cd .. && npm install --legacy-peer-deps

# Copy entire apps/web directory
COPY . .

# Build the Next.js app
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Copy built output and dependencies from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public 2>/dev/null || true

EXPOSE 3000
CMD ["npm", "start"]
