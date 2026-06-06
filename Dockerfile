# book'd CRM - Custom Twenty Image with Managed AI Agents
# 
# Build: docker build -t bookd/twenty:managed-ai-v1 .
# Push:  docker push bookd/twenty:managed-ai-v1

# Use the official Twenty CRM image as base
FROM twentycrm/twenty:latest AS base

# Switch to root to copy files
USER root

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Switch back to non-root user
USER node

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=5s --timeout=5s --retries=30 \
  CMD curl -f http://localhost:3000/healthz || exit 1

# Start the application
CMD ["yarn", "start:prod"]