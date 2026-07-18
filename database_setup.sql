-- ==============================================================================
-- Database Setup Script for MiShirt Project
-- ==============================================================================

-- 1. Create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS mishirt_db;
USE mishirt_db;

-- ==============================================================================
-- 2. Create the 'inventory' table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS inventory (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    sizeS INT(11) DEFAULT 20,
    sizeM INT(11) DEFAULT 20,
    sizeL INT(11) DEFAULT 20,
    sizeXL INT(11) DEFAULT 20
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================================================
-- 3. Seed the 'inventory' table with initial data
-- ==============================================================================
INSERT INTO inventory (type, sizeS, sizeM, sizeL, sizeXL) VALUES
    ('With The Wind', 20, 20, 20, 20),
    ('MFKDT Vision', 20, 20, 20, 20),
    ('Carhatt- MFKDT Style', 20, 20, 20, 20),
    ('Fly High', 20, 20, 20, 20),
    ('GOOSE Vibes', 20, 20, 20, 20),
    ('The PACLAPAT !', 20, 20, 20, 20),
    ('For The SARBAL', 20, 20, 20, 20),
    ('SHLAVIM', 20, 20, 20, 20),
    ('GOOSE-Emec', 20, 20, 20, 20);

-- ==============================================================================
-- 4. Create the 'orders' table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    stage VARCHAR(255) NOT NULL,
    shirt_id VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    quantity INT(11) NOT NULL,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
