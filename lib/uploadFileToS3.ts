import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Upload file to S3
export async function uploadFileToS3(file: File): Promise<string> {
  try {
    // Generate a unique filename
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Use the correct URL format for S3
    // This is the standard path-style URL format that works reliably
    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${uniqueFileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
