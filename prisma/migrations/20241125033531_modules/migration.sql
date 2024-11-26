/*
  Warnings:

  - You are about to drop the column `isRemoved` on the `subjects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `subjects` DROP COLUMN `isRemoved`,
    ADD COLUMN `is_removed` TINYINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_id` INTEGER NOT NULL,
    `name` VARCHAR(155) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `is_removed` TINYINT NOT NULL DEFAULT 0,
    `availableDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER NOT NULL,
    `file` VARCHAR(255) NOT NULL,
    `label` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_files` ADD CONSTRAINT `module_files_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
