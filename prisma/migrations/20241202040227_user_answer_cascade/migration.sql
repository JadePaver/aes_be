-- AlterTable
ALTER TABLE `user_answers` MODIFY `choice_id` INTEGER NULL,
    MODIFY `string_ans` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_assessment_result_id_fkey` FOREIGN KEY (`assessment_result_id`) REFERENCES `assessment_results`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
