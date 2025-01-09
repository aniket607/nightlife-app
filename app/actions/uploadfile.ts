"use server"
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadFile(formData: FormData) {
    const session = await auth();
    if (!session) {
        return { failure: "not authenticated" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    const fileBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
    });

    try {
        await s3.send(putObjectCommand);

        const signedUrl = await getSignedUrl(s3, putObjectCommand, {
            expiresIn: 3600,
        });
        console.log("File uploaded to AWS:", signedUrl.split("?")[0]);
        revalidatePath("/");

        return { 
            success: true, 
            message: "File uploaded successfully",
            fileName: fileName,
            url: signedUrl.split("?")[0]
        };
    } catch (error) {
        console.error("Error uploading file:", error);
        return { success: false, failure: "Error uploading file" };
    }
}