// Utilities for uploading to Vercel blob storage via API route

export async function createAvatarUploadUrl(file: File, userId: string) {
  const formData = new FormData();
  formData.append("file", file);

  const timestamp = new Date().toISOString();
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `avatars/${userId}/${timestamp}.${extension}`;
  formData.append("filename", filename);

  const response = await fetch("/api/avatar/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload avatar");
  }

  const data = await response.json();
  return data.url;
}
