SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `menus`;
SET FOREIGN_KEY_CHECKS = 1;

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

INSERT INTO `orders` (`java_quantity`, `java_subtotal`, `cafe_type`, `cafe_quantity`, `cafe_subtotal`, `cappuccino_type`, `cappuccino_quantity`, `cappuccino_subtotal`, `total_price`)
VALUES (1, 2.00, 'Single', 1, 2.00, 'Single', 1, 4.75, 8.75);

INSERT INTO `orders` (`java_quantity`, `java_subtotal`, `cafe_type`, `cafe_quantity`, `cafe_subtotal`, `cappuccino_type`, `cappuccino_quantity`, `cappuccino_subtotal`, `total_price`)
VALUES (0, 0, 'Double', 1, 3.00, 'Double', 1, 5.75, 8.75);