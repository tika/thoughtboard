import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DisplayRemark } from "@/components/remark";
import { client } from "@/lib/orpc";

export async function Feed() {
  // Get remarks and render
  const user = await currentUser();

  if (!user) return redirect("/");

  const remarks = await client.remark.getByUserId({ id: user.id });

  return (
    <div className="flex flex-col gap-4">
      {remarks.map((remark) => (
        <div key={remark.remark.id}>
          <DisplayRemark
            remark={{
              ...remark.remark,
              profile: { handle: user.publicMetadata.handle as string },
            }}
            reflectionId={remark.reflection?.id ?? null}
          />
        </div>
      ))}
    </div>
  );
}
