import { NextRequest } from "next/server";
import client from "@/lib/prisma";

export async function POST(req:NextRequest) {
const body= await req.json();
console.log(body);
const placeWithVenue = await client.places.create({
    data: {
      venueName: body.venueName,
      location: body.location,
      rating: parseFloat(body.rating),
      venue: {
        create: {
          address: body.address,
          locationUrl: body.locationUrl
        }
      }
    },
    include: {
      venue: true
    }
  });
  console.log(placeWithVenue);
return Response.json({
    message:"Data Saved"
})
}