-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `level` ENUM('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly') NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `method` VARCHAR(191) NULL,
    `route` VARCHAR(191) NULL,
    `statusCode` INTEGER NULL,
    `stack` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
