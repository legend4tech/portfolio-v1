/**
 * Client-side function to upload a file to S3 via our API route
 */
export async function uploadFileToS3(file: File): Promise<string> {
  try {
    // Get the base URL properly for all environments
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Make sure the URL is properly formatted with https if needed
    const apiUrl = baseUrl.startsWith("http")
      ? `${baseUrl}/api/upload`
      : `https://${baseUrl}/api/upload`;
    console.log("Uploading to:", apiUrl);

    // Create FormData and append the file
    const formData = new FormData();
    formData.append("file", file);

    // Upload via our API route (no CORS issues since it's same-origin)
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Upload successful, file available at:", data.fileUrl);

    return data.fileUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
