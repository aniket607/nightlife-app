-- CreateTable
CREATE TABLE "Places" (
    "id" SERIAL NOT NULL,
    "venueName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "venueId" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "locationUrl" TEXT,
    "placeId" INTEGER NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("venueId")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" SERIAL NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDescription" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "glCount" INTEGER NOT NULL,
    "venueIdentity" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Places_venueName_key" ON "Places"("venueName");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_placeId_key" ON "Venue"("placeId");

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venueIdentity_fkey" FOREIGN KEY ("venueIdentity") REFERENCES "Venue"("venueId") ON DELETE RESTRICT ON UPDATE CASCADE;
