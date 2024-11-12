/*
  Warnings:

  - You are about to alter the column `year` on the `classrooms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4)` to `Int`.

*/
-- AlterTable
ALTER TABLE `classrooms` MODIFY `year` INTEGER NOT NULL;
