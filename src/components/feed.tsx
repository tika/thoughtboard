import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DisplayRemark } from "@/components/remark";
import { client } from "@/lib/orpc";
import { profileService } from "@/services/profile";
import { CompletedProfile } from "@/db/schema";

export async function Feed() {
  // Get remarks and render
  const user = await currentUser();

  if (!user) return redirect("/");

  const remarks = await client.remark.getByUserId({ id: user.id });

  const profile = (await profileService.findOrCreateProfile(
    user.id,
  )) as CompletedProfile;

  return (
    <div className="flex flex-col gap-4">
      {remarks.map((remark) => (
        <div key={remark.remark.id}>
          <DisplayRemark
            remark={{
              ...remark.remark,
              profile: profile,
            }}
            reflectionId={remark.reflection?.id ?? null}
          />
        </div>
      ))}
    </div>
  );
}
