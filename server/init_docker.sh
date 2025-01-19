#!/bin/bash

# Load environment variables from the .env file
if [ -f .env ]; then
    echo "Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found. Please create one and define the required variables."
    exit 1
fi

# Stop and remove existing containers, and clean up volumes
echo "Stopping and removing existing containers..."
sudo docker-compose down -v

# Build and start the containers
echo "Building and starting containers..."
sudo docker-compose up -d --build
