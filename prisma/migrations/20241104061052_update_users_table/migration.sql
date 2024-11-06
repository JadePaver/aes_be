-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_code` VARCHAR(55) NULL,
    `role_id` INTEGER NULL,
    `fName` VARCHAR(55) NOT NULL,
    `lName` VARCHAR(55) NOT NULL,
    `mName` VARCHAR(55) NOT NULL,
    `ext_name` VARCHAR(55) NULL,
    `birthDate` DATE NOT NULL,
    `sex` INTEGER NOT NULL,
    `contact` VARCHAR(55) NOT NULL,
    `email` VARCHAR(55) NOT NULL,
    `username` VARCHAR(55) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `isRemove` TINYINT NOT NULL DEFAULT 0,
    `dateModified` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dateCreated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(55) NOT NULL,
    `code` VARCHAR(55) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sex_tbl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(155) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
