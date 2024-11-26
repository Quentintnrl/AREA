#!/bin/bash

#if param 1 == "tests"
if [ "$1" == "tests" ]; then
    ENV_FILE=$PWD/tests/.env
else
    ENV_FILE=$PWD/.env
fi

echo $ENV_FILE
export $(cat $ENV_FILE | xargs)
echo $MYSQL_HOST # This will print "your_host"
echo $MYSQL_USER  # This will print "your_user"
echo $MYSQL_USER_PASSWORD  # This will print "your_password"
echo $MYSQL_DATABASE # This will print "your_database"
echo $MYSQL_ROOT_PASSWORD # This will print "your_root_password"

# Run the MySQL commands, injecting environment variables
mysql -u root -p$MYSQL_ROOT_PASSWORD <<EOF
-- Check if the database exists, and create it if it does not
CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;

-- Use the database
USE $MYSQL_DATABASE;

-- Check if the user exists, and create it if it does not
CREATE USER IF NOT EXISTS '$MYSQL_USER' IDENTIFIED BY '$MYSQL_USER_PASSWORD';

-- Grant privileges to the new user on the new database
GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER';

-- Create the table (if it does not exist)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    client_password VARCHAR(100)
);

-- Grant specific table permissions to the user
GRANT SELECT, INSERT, UPDATE, DELETE ON $MYSQL_DATABASE.users TO '$MYSQL_USER';
EOF

