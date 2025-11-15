import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileService } from "@/services/profile";
import { AvatarForm } from "@/components/avatar-form";

export default async function AvatarPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await profileService.findOrCreateProfile(user.id);

  // Ensure we're on the right step or allow going back
  if (profile.onboardingStep === "completed") {
    redirect("/");
  }

  if (!profile.handle) {
    redirect("/onboarding/handle");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AvatarForm
        userId={user.id}
        currentAvatarUrl={profile.avatarUrl}
        handle={profile.handle}
      />
    </div>
  );
}
