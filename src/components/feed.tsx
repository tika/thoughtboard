import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/lib/orpc";
import { CreateReflectionModal } from "./create-reflection-modal";

export async function Feed() {
  // Get remarks and render
  const user = await currentUser();

  if (!user) return redirect("/");

  const remarks = await client.remark.getByUserId({ id: user.id });

  return (
    <div>
      {remarks.map((remark) => (
        <div key={remark.id}>
          <div>{remark.content}</div>
          <CreateReflectionModal remark={remark} />
        </div>
      ))}
    </div>
  );
}
