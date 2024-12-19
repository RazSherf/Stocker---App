# Step 1: Use a Node.js image to build the React application
FROM node:16 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the React app
RUN npm run build

# Step 2: Use Nginx to serve the static files
FROM nginx:alpine

# Copy the built React app to Nginx's default HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to allow external access
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]