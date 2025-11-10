"use client";

import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/post-editor";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => {
          router.back();
        }}
      >
        Close modal
      </button>
      <div>
        {children}
        <PostEditor />
      </div>
    </>
  );
}
