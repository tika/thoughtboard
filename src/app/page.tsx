import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button, Text } from "@radix-ui/themes";
import Link from "next/link";
import { PostModal } from "@/components/post-modal";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-950">
      <Text size="6">thoughtboard</Text>

      <PostModal />
      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <Button>Sign Up</Button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}
