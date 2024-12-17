#!/bin/bash

# Wait for the MySQL database to be ready
echo "Waiting for database to be ready..."
dockerize -wait tcp://db:3306 -timeout 60s

# Start the server application
echo "Starting the server..."
npm start
