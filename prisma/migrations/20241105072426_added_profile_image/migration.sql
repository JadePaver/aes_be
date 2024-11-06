-- CreateTable
CREATE TABLE `profile_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `label` VARCHAR(255) NOT NULL,
    `file` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `profile_image_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
