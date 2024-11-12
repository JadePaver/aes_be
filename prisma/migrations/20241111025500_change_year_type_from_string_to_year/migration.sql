/*
  Warnings:

  - You are about to alter the column `grade` on the `classrooms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(155)` to `Int`.

*/
-- AlterTable
ALTER TABLE `classrooms` MODIFY `grade` INTEGER NOT NULL;
