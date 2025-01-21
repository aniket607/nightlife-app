-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "featuredEvent" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "featuredVenue" BOOLEAN DEFAULT false;
