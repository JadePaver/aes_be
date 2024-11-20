/*
  Warnings:

  - You are about to alter the column `code` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `VarChar(155)` to `VarChar(55)`.
  - Added the required column `year` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subjects` ADD COLUMN `class_id` INTEGER NULL,
    ADD COLUMN `isRemoved` TINYINT NOT NULL DEFAULT 0,
    ADD COLUMN `year` VARCHAR(55) NOT NULL,
    MODIFY `code` VARCHAR(55) NOT NULL;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classrooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
