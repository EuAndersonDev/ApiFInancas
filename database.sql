CREATE DATABASE apiFinances;
USE apiFinances;

CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE account (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    balance DECIMAL(19,2) NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    date DATE NOT NULL,
    type ENUM('withdrawal', 'deposit') NOT NULL,
    user_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (account_id) REFERENCES account(id)
);

-- Primeiro insira o usuário
INSERT INTO user (name, email, password) VALUES ('Test User', 'testuser@example.com', 'password123');

-- Depois insira a conta
INSERT INTO account (balance, user_id) VALUES (1000.00, 1);