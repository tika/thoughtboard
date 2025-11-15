import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileService } from "@/services/profile";

export default async function OnboardingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await profileService.findOrCreateProfile(user.id);

  // If already completed, redirect to main app
  if (profile.onboardingStep === "completed") {
    redirect("/");
  }

  // Redirect to the current step or welcome if not started
  const step = profile.onboardingStep || "welcome";
  redirect(`/onboarding/${step}`);
}
