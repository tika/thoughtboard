import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-950">
      <Text size="6">thoughtboard</Text>

      <Button>Post</Button>

      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <Button>Sign Up</Button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}
