/*
  Warnings:

  - A unique constraint covering the columns `[file,label,module_id]` on the table `module_files` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,subject_id]` on the table `modules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `module_files_file_label_module_id_key` ON `module_files`(`file`, `label`, `module_id`);

-- CreateIndex
CREATE UNIQUE INDEX `modules_name_subject_id_key` ON `modules`(`name`, `subject_id`);
