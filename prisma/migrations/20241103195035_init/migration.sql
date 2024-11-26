-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "senderId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Account_Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
