import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileService } from "@/services/profile";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await profileService.findOrCreateProfile(user.id);

  // Don't redirect from layout - let individual pages handle their own redirects
  // This allows the completed page to render after finishing onboarding
  // Other pages will redirect themselves if onboarding is already completed

  return <>{children}</>;
}

