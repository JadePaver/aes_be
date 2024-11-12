-- CreateTable
CREATE TABLE `classrooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(155) NOT NULL,
    `name` VARCHAR(155) NOT NULL,
    `grade` VARCHAR(155) NOT NULL,
    `year` VARCHAR(4) NOT NULL,
    `isRemoved` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `classrooms_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assigned_classroom` (
    `class_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `assigned_classroom_class_id_key`(`class_id`),
    UNIQUE INDEX `assigned_classroom_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assigned_classroom` ADD CONSTRAINT `assigned_classroom_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assigned_classroom` ADD CONSTRAINT `assigned_classroom_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classrooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
