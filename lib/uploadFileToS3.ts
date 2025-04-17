export async function uploadFileToS3(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Get the base URL properly for all environments
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Make sure the URL is properly formatted
    const apiUrl = `${baseUrl}/api/public-upload`;
    console.log("Uploading to:", apiUrl); // Debug log

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // Log the actual response text for debugging
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.fileUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
