import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { Landing } from "@/app/landing";
import { Feed } from "@/components/feed";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
        <Feed />
      </SignedIn>

      <SignedOut>
        <Landing />
      </SignedOut>
    </div>
  );
}
