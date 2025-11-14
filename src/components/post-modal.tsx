"use client";

import { Button, Dialog } from "@radix-ui/themes";
import { PostEditor } from "@/components/post-editor";

export function PostModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Post Thought</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <PostEditor />
      </Dialog.Content>
    </Dialog.Root>
  );
}
