import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { profileService } from "@/services/profile";

export default async function CompletedPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await profileService.findOrCreateProfile(user.id);

  // If not completed, redirect to current step
  if (profile.onboardingStep !== "completed") {
    redirect(`/onboarding/${profile.onboardingStep}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to thoughtboard!</CardTitle>
          <CardDescription>
            You&apos;re all set. Here&apos;s how the platform works:
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Remarks</h3>
              <p className="text-muted-foreground">
                Remarks are microblog posts limited to 280 characters. Share
                quick thoughts, ideas, or updates with the community.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Reflections</h3>
              <p className="text-muted-foreground">
                Reflections are longer-form posts (at least 140 characters) that
                can be linked to your remarks. Use them to expand on your
                thoughts or dive deeper into topics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">The Feed</h3>
              <p className="text-muted-foreground">
                Your feed displays all remarks from users you follow. You can
                create reflections from your remarks to provide more context or
                detail.
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <Link href="/onboarding/avatar">
              <Button type="button" variant="outline">
                Previous
              </Button>
            </Link>
            <Link href="/">
              <Button>Get Started</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

