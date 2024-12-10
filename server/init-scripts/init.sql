-- Switch to the target database
USE area_database;

-- Create the `users` table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    client_password VARCHAR(100)
);

-- Create the `services` table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
);

-- Create the `users_services_login` table
CREATE TABLE IF NOT EXISTS users_services_login (
    user_id INT,
    service_id INT,
    connect_token JSON,
    PRIMARY KEY (user_id, service_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Create the `actions` table
CREATE TABLE IF NOT EXISTS actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT,
    name VARCHAR(50),
    params JSON,
    description VARCHAR(255),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Create the `reactions` table
CREATE TABLE IF NOT EXISTS reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT,
    name VARCHAR(50),
    params JSON,
    description VARCHAR(255),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Create the `action_reaction` table
CREATE TABLE IF NOT EXISTS action_reaction (
    user_id INT,
    action JSON,
    reaction JSON,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the `templates` table
CREATE TABLE IF NOT EXISTS templates (
    action_id INT,
    reaction_id INT,
    PRIMARY KEY (action_id, reaction_id),
    FOREIGN KEY (action_id) REFERENCES actions(id),
    FOREIGN KEY (reaction_id) REFERENCES reactions(id)
);