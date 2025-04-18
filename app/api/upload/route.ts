import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });

    // Generate a unique filename
    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3 without ACL parameter
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
    });

    try {
      await s3Client.send(command);
      // Removed success log
    } catch (s3Error) {
      // Keep error logging for production troubleshooting
      console.error("S3 Upload Error:", s3Error);
      return NextResponse.json(
        {
          error: `S3 upload failed: ${s3Error instanceof Error ? s3Error.message : String(s3Error)}`,
        },
        { status: 500 }
      );
    }

    // Calculate the final URL where the file will be accessible
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    // Keep error logging for production troubleshooting
    console.error("Error in upload API route:", error);
    return NextResponse.json(
      {
        error: `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}
