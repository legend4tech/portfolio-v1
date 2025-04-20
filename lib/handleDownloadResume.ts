export const handleDownloadResume = () => {
  // Create a link element
  const link = document.createElement("a");

  // Set the href to the path of your resume file
  link.href = "/dennis-ajulu-resume.pdf";

  // Set download attribute to suggest filename
  link.download = "dennis-ajulu-resume.pdf";

  // Append to the document
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Clean up
  document.body.removeChild(link);
};
