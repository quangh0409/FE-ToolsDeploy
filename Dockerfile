# 1. For build React app
FROM node:18-alpine AS development
# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install -g npm@10.7.0
RUN npm install
RUN npm ci

# Copy the rest of the application code
COPY . /app

# Copy the .env file
COPY .env /app/.env

# Build the application
RUN npm run build

# 2. For Nginx setup
FROM nginx:alpine
# Copy config nginx
COPY --from=development /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=development /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]