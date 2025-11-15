// Utilities for uploading to Vercel blob storage. Client-side

import { upload } from "@vercel/blob/client";
import mime from "mime/lite";

export async function createAvatarUploadUrl(file: Blob, userId: string) {
  const extension = mime.getExtension(file.type);

  const timestamp = new Date().toISOString();
  const res = await upload(
    `avatars/${userId}/${timestamp}.${extension}`,
    file,
    {
      access: "public",
      contentType: file.type,
      handleUploadUrl: "/api/avatar/upload",
    },
  );

  return res.url;
}
