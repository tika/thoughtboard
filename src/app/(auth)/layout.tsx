import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Landing } from "@/app/landing";
import { profileService } from "@/services/profile";
import { remarkService } from "@/services/remark";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // If not authenticated, show landing page without sidebar
  if (!user) {
    return <Landing />;
  }

  // Ensure profile exists and is completed
  const profile = await profileService.findOrCreateProfile(user.id);

  if (profile.onboardingStep !== "completed") {
    redirect(`/onboarding/${profile.onboardingStep}`);
  }

  // Ensure profile has handle
  if (!profile.handle) {
    redirect("/onboarding/handle");
  }

  // Fetch remark ready for reflection
  const readyRemark = await remarkService.getReadyForReflection({
    userId: user.id,
  });

  return (
    <div className="flex h-screen">
      <aside className="fixed left-0 top-0 h-full w-80 border-r border-sidebar-border bg-sidebar">
        <AppSidebar
          profile={{
            handle: profile.handle,
            avatarUrl: profile.avatarUrl,
          }}
          readyRemark={readyRemark}
        />
      </aside>
      <main className="flex-1 ml-80 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
