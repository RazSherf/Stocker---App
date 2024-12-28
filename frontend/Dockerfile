# # Step 1: Use a Node.js image to build the React application
# FROM node:16 as build

# # Set the working directory inside the container
# WORKDIR /app

# # Copy only package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the project files
# COPY . .

# # Build the React app
# RUN npm run build

# EXPOSE 3000

# CMD ["npm", "start"]



# Build stage
FROM node:16 as build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built files from build stage to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Add nginx configuration (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]