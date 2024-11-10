/*
  Warnings:

  - You are about to drop the column `isLock` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isRemove` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `isLock`,
    DROP COLUMN `isRemove`,
    ADD COLUMN `isLocked` TINYINT NOT NULL DEFAULT 0,
    ADD COLUMN `isRemoved` TINYINT NOT NULL DEFAULT 0;
