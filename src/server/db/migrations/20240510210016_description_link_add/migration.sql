/*
  Warnings:

  - Made the column `userId` on table `Show` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_userId_fkey";

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "description" TEXT,
ADD COLUMN     "link" TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Episode_showId_idx" ON "Episode"("showId");

-- CreateIndex
CREATE INDEX "Show_userId_idx" ON "Show"("userId");

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
