import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Landing } from "@/app/landing";
import { Feed } from "@/components/feed";
import { Button } from "@/components/ui/button";
import { profileService } from "@/services/profile";

export default async function Home() {
  const user = await currentUser();

  // If signed in, check onboarding status
  if (user) {
    const profile = await profileService.findOrCreateProfile(user.id);

    // Redirect to onboarding if not completed
    if (profile.onboardingStep !== "completed") {
      redirect(`/onboarding/${profile.onboardingStep}`);
    }
  }

  return (
    <div className="min-h-screen">
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
        <p>{user?.publicMetadata.handle as string}</p>
        <Feed />
      </SignedIn>

      <SignedOut>
        <Landing />
      </SignedOut>
    </div>
  );
}
