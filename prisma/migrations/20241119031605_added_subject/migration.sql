-- CreateTable
CREATE TABLE `subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(155) NOT NULL,
    `name` VARCHAR(155) NOT NULL,
    `dateCreated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assigned_subject` (
    `user_id` INTEGER NOT NULL,
    `class_id` INTEGER NULL,

    UNIQUE INDEX `assigned_subject_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assigned_subject` ADD CONSTRAINT `assigned_subject_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assigned_subject` ADD CONSTRAINT `assigned_subject_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
