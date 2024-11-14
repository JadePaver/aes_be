-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_id_fkey` FOREIGN KEY (`id`) REFERENCES `archive_codes`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
