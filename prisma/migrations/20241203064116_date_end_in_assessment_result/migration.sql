/*
  Warnings:

  - Added the required column `dateEnd` to the `assessment_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assessment_results` ADD COLUMN `dateEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `isRetake` TINYINT NOT NULL DEFAULT 0;
