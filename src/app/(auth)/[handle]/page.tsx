import { notFound } from "next/navigation";
import { DisplayRemark } from "@/components/remark";
import { client } from "@/lib/orpc";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const profile = await client.profile.getByHandle({ handle });

  if (!profile) {
    notFound();
  }

  const remarks = await client.remark.getByUserId({ id: profile.id });

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">@{handle}</h1>
      </div>
      {remarks.map((remark) => (
        <div key={remark.remark.id}>
          <DisplayRemark
            remark={{
              ...remark.remark,
              profile: { handle, avatarUrl: profile.avatarUrl },
            }}
            reflectionId={remark.reflection?.id ?? null}
          />
        </div>
      ))}
    </div>
  );
}
