# Base stage for dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS build
COPY . .
ARG APP_NAME
RUN npx nest build ${APP_NAME}

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist/apps/${APP_NAME} ./dist

# Start the application
CMD ["node", "dist/main.js"]
