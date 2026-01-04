# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Define the arguments
ARG VITE_APP_API_URL
ARG VITE_EXPORT_API_URL
ARG VITE_MICROSERVICES_API_URL

# Set them as environment variables so Vite sees them
ENV VITE_APP_API_URL=$VITE_APP_API_URL
ENV VITE_EXPORT_API_URL=$VITE_EXPORT_API_URL
ENV VITE_MICROSERVICES_API_URL=$VITE_MICROSERVICES_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy the build output from the first stage to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Use nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]