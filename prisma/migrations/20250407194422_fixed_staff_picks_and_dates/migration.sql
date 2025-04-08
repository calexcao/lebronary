-- AlterTable
ALTER TABLE `borrowings` MODIFY `return_date` DATE NULL;

-- CreateIndex
CREATE INDEX `user_id` ON `staff_picks`(`user_id`);

-- AddForeignKey
ALTER TABLE `staff_picks` ADD CONSTRAINT `staff_picks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
