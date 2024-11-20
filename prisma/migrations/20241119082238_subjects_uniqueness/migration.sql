/*
  Warnings:

  - A unique constraint covering the columns `[name,year,class_id]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `subjects_name_year_class_id_key` ON `subjects`(`name`, `year`, `class_id`);
