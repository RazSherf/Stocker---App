# Step 1: Use a Node.js image to build the React application
FROM node:16 as build

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the React app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]