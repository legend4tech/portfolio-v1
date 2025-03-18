// Modified to use the API route instead of direct S3 upload
export async function uploadFileToS3(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Get the base URL dynamically
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload file");
    }

    const data = await response.json();
    return data.fileUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
