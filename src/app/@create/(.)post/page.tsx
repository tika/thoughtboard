import { Text } from "@radix-ui/themes";
import { PostEditor } from "@/components/post-editor";
import { Modal } from "@/components/post-modal";

export default function Page() {
  return (
    <Modal>
      <PostEditor />
    </Modal>
  );
}
