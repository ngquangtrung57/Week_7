CREATE TABLE `menus` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `java` DECIMAL(10, 2) NOT NULL,
    `cafe_single` DECIMAL(10, 2) NOT NULL,
    `cafe_double` DECIMAL(10, 2) NOT NULL,
    `cappuccino_single` DECIMAL(10, 2) NOT NULL,
    `cappuccino_double` DECIMAL(10, 2) NOT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial default prices
INSERT INTO `menus` (`java`, `cafe_single`, `cafe_double`, `cappuccino_single`, `cappuccino_double`)
VALUES (2.00, 2.00, 3.00, 4.75, 5.75);

-- Orders table
CREATE TABLE `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `java_quantity` INT NOT NULL DEFAULT 0,
    `java_subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `cafe_type` VARCHAR(10) DEFAULT NULL,
    `cafe_quantity` INT NOT NULL DEFAULT 0,
    `cafe_subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `cappuccino_type` VARCHAR(10) DEFAULT NULL,
    `cappuccino_quantity` INT NOT NULL DEFAULT 0,
    `cappuccino_subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `ordered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;