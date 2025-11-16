import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DisplayRemark } from "@/components/remark";
import type { CompletedProfile } from "@/db/schema";
import { client } from "@/lib/orpc";
import { profileService } from "@/services/profile";

export default async function AuthPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const remarks = await client.remark.getByUserId({ id: user.id });

  const profile = (await profileService.findOrCreateProfile(
    user.id,
  )) as CompletedProfile;

  return (
    <div className="flex flex-col gap-4 p-6">
      {remarks.map((remark) => (
        <div key={remark.remark.id}>
          <DisplayRemark
            remark={{
              ...remark.remark,
              profile: {
                handle: profile.handle,
                avatarUrl: profile.avatarUrl,
              },
            }}
            reflectionId={remark.reflection?.id ?? null}
          />
        </div>
      ))}
    </div>
  );
}
