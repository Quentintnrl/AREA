-- Check if the database exists, and create it if it does not
CREATE DATABASE IF NOT EXISTS area_database;

-- Use the database
USE area_database;

-- Check if the user exists, and create it if it does not
CREATE USER IF NOT EXISTS 'Admin'@'localhost' IDENTIFIED BY ;

-- Grant privileges to the new user on the new database
GRANT ALL PRIVILEGES ON area_database.* TO 'Admin'@'localhost';

-- Create the table (if it does not exist)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    client_password VARCHAR(100)
);

-- Grant specific table permissions to the user
GRANT SELECT, INSERT, UPDATE, DELETE ON area_database.users TO 'Admin'@'localhost';

-- -- Insert sample data (if it does not already exist)
-- INSERT INTO users (username, email, client_password)
--     SELECT 'testuser', 'test@example.com', 'password'
--     WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'testuser');