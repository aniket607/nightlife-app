/*
  Warnings:

  - You are about to drop the column `glCount` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Guestlist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coupleGl` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stagGlCount` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Guestlist" DROP CONSTRAINT "Guestlist_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "glCount",
ADD COLUMN     "coupleGl" BOOLEAN NOT NULL,
ADD COLUMN     "coupleGlCount" INTEGER,
ADD COLUMN     "eventType" TEXT NOT NULL,
ADD COLUMN     "stagGlCount" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Guestlist";

-- CreateTable
CREATE TABLE "StagGuestlist" (
    "glId" SERIAL NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestAge" INTEGER NOT NULL,
    "guestMobile" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "StagGuestlist_pkey" PRIMARY KEY ("glId")
);

-- CreateTable
CREATE TABLE "CoupleGuestlist" (
    "glId" SERIAL NOT NULL,
    "maleName" TEXT NOT NULL,
    "femaleName" TEXT NOT NULL,
    "maleAge" INTEGER NOT NULL,
    "femaleAge" INTEGER NOT NULL,
    "maleMobile" TEXT NOT NULL,
    "femaleMobile" TEXT NOT NULL,
    "maleEmail" TEXT NOT NULL,
    "femaleEmail" TEXT,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "CoupleGuestlist_pkey" PRIMARY KEY ("glId")
);

-- AddForeignKey
ALTER TABLE "StagGuestlist" ADD CONSTRAINT "StagGuestlist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoupleGuestlist" ADD CONSTRAINT "CoupleGuestlist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
