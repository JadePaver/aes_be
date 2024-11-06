/*
  Warnings:

  - You are about to drop the column `sex` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `sex`,
    ADD COLUMN `sex_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_sex_id_fkey` FOREIGN KEY (`sex_id`) REFERENCES `sex_tbl`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
