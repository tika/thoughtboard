import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileService } from "@/services/profile";
import { HandleForm } from "@/components/handle-form";

export default async function HandlePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await profileService.findOrCreateProfile(user.id);

  // Ensure we're on the right step or allow going back
  if (profile.onboardingStep === "completed") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <HandleForm userId={user.id} currentHandle={profile.handle} />
    </div>
  );
}

