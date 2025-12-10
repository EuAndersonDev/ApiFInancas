DROP DATABASE IF EXISTS apiFinances;
CREATE DATABASE IF NOT EXISTS apiFinances;
USE apiFinances;


CREATE TABLE IF NOT EXISTS `user` (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS category (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS account (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    balance DECIMAL(19,2) NOT NULL,
    user_id CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `transaction` (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    date DATE NOT NULL,
    type ENUM('withdrawal', 'deposit') NOT NULL,
    user_id CHAR(36) NOT NULL,
    account_id CHAR(36) NOT NULL,
    category_id CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_tx_user FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    CONSTRAINT fk_tx_account FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_tx_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `user` (name, email, password) 
SELECT 'Test User', 'testuser@example.com', 'password123'
WHERE NOT EXISTS (SELECT 1 FROM `user` WHERE email = 'testuser@example.com');


INSERT INTO account (balance, user_id) 
SELECT 1000.00, id FROM `user` WHERE email = 'testuser@example.com'
AND NOT EXISTS (SELECT 1 FROM account WHERE user_id = (SELECT id FROM `user` WHERE email = 'testuser@example.com'));


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
