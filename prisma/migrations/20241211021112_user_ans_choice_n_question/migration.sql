-- AddForeignKey
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_choice_id_fkey` FOREIGN KEY (`choice_id`) REFERENCES `choices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
