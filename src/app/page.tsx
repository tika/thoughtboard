import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Feed } from "@/components/feed";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <p>thoughtboard</p>
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
        <Feed />
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
        <SignUpButton>
          <Button>Sign Up</Button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}
