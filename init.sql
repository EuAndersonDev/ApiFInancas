
CREATE DATABASE IF NOT EXISTS apiFinances;
USE apiFinances;


CREATE TABLE IF NOT EXISTS `user` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS account (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    balance DECIMAL(19,2) NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS `transaction` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    date DATE NOT NULL,
    type ENUM('withdrawal', 'deposit') NOT NULL,
    user_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);


INSERT INTO `user` (name, email, password) 
SELECT 'Test User', 'testuser@example.com', 'password123'
WHERE NOT EXISTS (SELECT 1 FROM `user` WHERE email = 'testuser@example.com');


INSERT INTO account (balance, user_id) 
SELECT 1000.00, 1
WHERE NOT EXISTS (SELECT 1 FROM account WHERE user_id = 1);


-- Procedure para inserir categorias padrão
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS InsertDefaultCategories()
BEGIN
    INSERT IGNORE INTO category (name) VALUES ('Food');
    INSERT IGNORE INTO category (name) VALUES ('Transport');
    INSERT IGNORE INTO category (name) VALUES ('Entertainment');
    INSERT IGNORE INTO category (name) VALUES ('Health');
    INSERT IGNORE INTO category (name) VALUES ('Utilities');
    INSERT IGNORE INTO category (name) VALUES ('Study');
END$$

DELIMITER ;

-- Executar a procedure
CALL InsertDefaultCategories();
