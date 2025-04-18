/**
 * Client-side function to upload a file to S3 via our API route
 */
export async function uploadFileToS3(file: File): Promise<string> {
  try {
    // In production, we need to use the absolute URL with https
    // This is a more reliable way to construct the API URL in Vercel
    const apiUrl = "/api/upload";
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
