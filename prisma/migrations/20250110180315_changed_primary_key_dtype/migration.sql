/*
  Warnings:

  - The primary key for the `Venue` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_venueId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "venueId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Venue_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Venue_id_seq";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
