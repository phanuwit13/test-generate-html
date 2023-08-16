# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory within the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your React app runs on
EXPOSE 3000

# Command to start the React app
CMD ["npm", "start"]
