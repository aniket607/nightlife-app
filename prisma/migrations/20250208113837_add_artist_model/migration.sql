-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventArtist" (
    "event_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "EventArtist_pkey" PRIMARY KEY ("event_id","artist_id")
);

-- AddForeignKey
ALTER TABLE "EventArtist" ADD CONSTRAINT "EventArtist_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventArtist" ADD CONSTRAINT "EventArtist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
