import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/lib/orpc";

export async function Feed() {
  // Get remarks and render
  const user = await currentUser();

  if (!user) return redirect("/");

  const remarks = await client.remark.getByUserId({ id: user.id });

  return (
    <div>
      {remarks.map((remark) => (
        <div key={remark.id}>{remark.content}</div>
      ))}
    </div>
  );
}
