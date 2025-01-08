# Use the latest LTS version of Node.js
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on (default for Next.js is 3000)
EXPOSE 3000

# Command to start the application
CMD ["npm", "run", "start"]
