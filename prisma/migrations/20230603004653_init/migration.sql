/*
  Warnings:

  - You are about to drop the column `episodNumber` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Show` table. All the data in the column will be lost.
  - Added the required column `episodeNumber` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonNumber` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "episodeNumber" INTEGER NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    CONSTRAINT "Episode_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("id", "showId") SELECT "id", "showId" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
CREATE TABLE "new_Show" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Show_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Show" ("id", "title") SELECT "id", "title" FROM "Show";
DROP TABLE "Show";
ALTER TABLE "new_Show" RENAME TO "Show";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
