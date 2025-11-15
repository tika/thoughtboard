import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DisplayRemark } from "@/components/remark";
import { client } from "@/lib/orpc";

export default async function AuthPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const remarks = await client.remark.getByUserId({ id: user.id });

  return (
    <div className="flex flex-col gap-4 p-6">
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
