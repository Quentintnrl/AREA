USE area_database;
-- Check current database
SELECT DATABASE();

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
    name VARCHAR(50)
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
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action JSON,
    reaction JSON,
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

-- Insert the service 'Spotify'
INSERT INTO services (name) VALUES ('Spotify');
SELECT ROW_COUNT();  -- Check if 1 row was inserted

-- Insert the reaction 'Play a track'
INSERT INTO reactions (service_id, name, params, description)
VALUES (1, 'Play a track', '{"params": [{"name": "Track Uri", "type": "string"}]}', 'Play a track on Spotify');
SELECT ROW_COUNT();

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (1, 'A track is played', '{"params": [{"name": "Track Uri", "type": "string"}]}', 'When a track is played on Spotify');
SELECT ROW_COUNT();

INSERT INTO actions (service_id, name, params, description)
VALUES (1, 'A track is added to a playlist', '{"params": [{"name": "Playlist Uri", "type": "string"}]}', 'When a track is added to a playlist on Spotify');
SELECT ROW_COUNT();

-- Insert the service 'Github'
INSERT INTO services (name) VALUES ('Github');
SELECT ROW_COUNT();  -- Check if 1 row was inserted

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (2, 'New private commit', '{"params": [{"name": "Repo Url", "type": "string"}, {"name": "Owner", "type": "string"}, {"name": "Token", "type": "string"}]}', 'When a commit is pushed on one of my repository');
SELECT ROW_COUNT();

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (2, 'New public commit', '{"params": [{"name": "Repo Url", "type": "string"}, {"name": "Owner", "type": "string"}]}', 'When a commit is pushed on a public repository');
SELECT ROW_COUNT();

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (2, 'New private pullrequest', '{"params": [{"name": "Repo Url", "type": "string"}, {"name": "Owner", "type": "string"}, {"name": "Token", "type": "string"}]}', 'When a pullrequest is open on one of my repository');
SELECT ROW_COUNT();

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (2, 'New public pullrequest', '{"params": [{"name": "Repo Url", "type": "string"}, {"name": "Owner", "type": "string"}]}', 'When a pullrequest is open on a public repository');
SELECT ROW_COUNT();

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (2, 'New private followers', '{"params": [{"name": "User", "type": "string"}, {"name": "Token", "type": "string"}]}', 'When a you get a new follower on your account');
SELECT ROW_COUNT();

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (2, 'New public followers', '{"params": [{"name": "User", "type": "string"}]}', 'When an user get a new follower on his account');
SELECT ROW_COUNT();

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (2, 'New private star', '{"params": [{"name": "Repo Url", "type": "string"}, {"name": "Owner", "type": "string"}, {"name": "Token", "type": "string"}]}', 'When a new star is add on one of my repository');
SELECT ROW_COUNT();

-- Insert actions
INSERT INTO actions (service_id, name, params, description)
VALUES (2, 'New public star', '{"params": [{"name": "Repo Url", "type": "string"}, {"name": "Owner", "type": "string"}]}', 'When a new star is add on a public repository');
SELECT ROW_COUNT();
