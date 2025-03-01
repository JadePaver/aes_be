/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user_answers` MODIFY `choice_id` INTEGER NULL,
    MODIFY `string_ans` VARCHAR(5000) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `subjects_code_key` ON `subjects`(`code`);

-- AddForeignKey
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_assessment_result_id_fkey` FOREIGN KEY (`assessment_result_id`) REFERENCES `assessment_results`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
