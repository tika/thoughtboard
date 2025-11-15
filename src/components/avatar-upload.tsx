"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProfileAvatar } from "@/components/avatar";
import { createAvatarUploadUrl } from "@/lib/blob";

export function AvatarUpload({
  profile,
}: {
  profile: {
    avatarUrl: string | null;
    handle: string;
  };
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          if (!user) return router.push("/"); // user is guaranteed to be defined by Clerk

          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }

          const file = inputFileRef.current.files[0];

          console.log(file);

          const newBlob = await createAvatarUploadUrl(file, user.id);

          setUrl(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>

      {url && <ProfileAvatar profile={profile} />}
    </>
  );
}
