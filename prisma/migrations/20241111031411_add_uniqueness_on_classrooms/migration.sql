/*
  Warnings:

  - A unique constraint covering the columns `[name,year,grade]` on the table `classrooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `classrooms_name_year_grade_key` ON `classrooms`(`name`, `year`, `grade`);
