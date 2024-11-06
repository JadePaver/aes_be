-- CreateTable
CREATE TABLE `archive_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(155) NOT NULL,
    `user_id` INTEGER NULL,

    UNIQUE INDEX `archive_codes_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
