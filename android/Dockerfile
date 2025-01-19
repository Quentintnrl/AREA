# Use an official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /mobile_app

# Copy your package.json and package-lock.json (if available)
# This allows us to install dependencies before copying the rest of the files
COPY package*.json ./

RUN apt-get update && apt-get install -y curl

# Install project dependencies
RUN npm install

# Install Expo CLI globally
RUN npm install -g expo-cli

# Install EAS CLI globally
RUN npm install -g eas-cli

# Copy the rest of the files (including your get_mobile_app.sh script)
COPY . .

# Ensure get_mobile_app.sh is executable
RUN chmod +x ./get_mobile_app.sh

# Execute the get_mobile_app.sh script
# CMD ["./get_mobile_app.sh"]
