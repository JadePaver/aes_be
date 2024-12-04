-- CreateTable
CREATE TABLE `assessment_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assessment_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `total_score` INTEGER NULL,
    `max_score` INTEGER NULL,
    `dateStarted` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateSubmitted` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assessment_result_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `choice_id` INTEGER NOT NULL,
    `string_ans` VARCHAR(191) NOT NULL,
    `isCorrect` TINYINT NOT NULL DEFAULT 0,
    `points_earned` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
