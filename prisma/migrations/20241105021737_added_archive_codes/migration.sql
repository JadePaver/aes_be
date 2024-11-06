/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `archive_codes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `archive_codes_code_key` ON `archive_codes`(`code`);
