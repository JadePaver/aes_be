-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_id_fkey`;

-- AddForeignKey
ALTER TABLE `archive_codes` ADD CONSTRAINT `archive_codes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
