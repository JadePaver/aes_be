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
    `sex_id` INTEGER NULL,
    `contact` VARCHAR(55) NOT NULL,
    `email` VARCHAR(55) NOT NULL,
    `username` VARCHAR(55) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `isRemoved` TINYINT NOT NULL DEFAULT 0,
    `isLocked` TINYINT NOT NULL DEFAULT 0,
    `dateModified` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dateCreated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classrooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(155) NOT NULL,
    `name` VARCHAR(155) NOT NULL,
    `grade` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `isRemoved` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `classrooms_code_key`(`code`),
    UNIQUE INDEX `classrooms_name_year_grade_key`(`name`, `year`, `grade`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assigned_classroom` (
    `user_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,

    UNIQUE INDEX `assigned_classroom_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `graduate_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `graduation_date` DATETIME(3) NOT NULL,
    `date_added` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `graduate_records_user_id_key`(`user_id`),
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
CREATE TABLE `profile_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `label` VARCHAR(255) NOT NULL,
    `file` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `profile_image_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sex_tbl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(155) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archive_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(155) NOT NULL,
    `user_id` INTEGER NULL,

    UNIQUE INDEX `archive_codes_code_key`(`code`),
    UNIQUE INDEX `archive_codes_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_sex_id_fkey` FOREIGN KEY (`sex_id`) REFERENCES `sex_tbl`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assigned_classroom` ADD CONSTRAINT `assigned_classroom_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assigned_classroom` ADD CONSTRAINT `assigned_classroom_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classrooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `graduate_records` ADD CONSTRAINT `graduate_records_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_image` ADD CONSTRAINT `profile_image_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
