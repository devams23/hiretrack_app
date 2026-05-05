# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Arguments passed from Jenkins
ARG SUPABASE_URL
ARG SUPABASE_KEY

# 1. Install dependencies
COPY Sessions/hiretrack/package*.json ./
RUN npm install

# 2. Copy the Angular source code
COPY Sessions/hiretrack/ .

# 3. Overwrite the environment file using the ARGs
# This happens INSIDE the temporary build container

# Ensure the directory exists && Overwrite the environment file using the ARGs
RUN mkdir -p src/environments && \
    echo "export const environment = { \
    production: true, \
    supabaseUrl: '${SUPABASE_URL}', \
    supabaseKey: '${SUPABASE_KEY}' \
    };" > src/environments/environment.development.ts

# 4. Build the app
RUN npx ng build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/hiretrack/browser /usr/share/nginx/html

# Simple Nginx config to support Angular routing
RUN printf 'server { \n\
    listen 80; \n\
    location / { \n\
    root /usr/share/nginx/html; \n\
    index index.html; \n\
    try_files $uri $uri/ /index.html; \n\
    } \n\
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]