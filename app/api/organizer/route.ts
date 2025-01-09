import { NextRequest } from "next/server";
import client from "@/lib/prisma";

export async function POST(req:NextRequest) {
const body= await req.json();
console.log(body);

return Response.json({
    message:"Data Saved"
})
}