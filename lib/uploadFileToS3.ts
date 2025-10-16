export async function uploadFileToS3(file: File): Promise<string> {
  try {
    const apiUrl = "/api/upload";

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", response.status, errorText);
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
