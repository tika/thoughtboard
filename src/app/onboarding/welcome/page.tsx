import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { profileService } from "@/services/profile";

export default async function WelcomePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await profileService.findOrCreateProfile(user.id);

  // Ensure we're on the right step
  if (profile.onboardingStep !== "welcome") {
    redirect(`/onboarding/${profile.onboardingStep}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to thoughtboard</CardTitle>
          <CardDescription>
            Before you begin posting, we need to set up your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            We&apos;ll guide you through a few quick steps to get you started.
            This will only take a minute.
          </p>
          <div className="flex justify-end">
            <Link href="/onboarding/handle">
              <Button>Get Started</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
