import { notFound } from "next/navigation";
import { client } from "@/lib/orpc";
import { remarkService } from "@/services/remark";

export default async function ReflectionPage({
  params,
}: {
  params: Promise<{ handle: string; reflectionId: string }>;
}) {
  const { handle, reflectionId } = await params;

  const reflection = await client.reflection.getById({ id: reflectionId });

  if (!reflection) {
    notFound();
  }

  // Get the remark associated with this reflection
  const remark = await remarkService.getById({ id: reflection.remarkId ?? "" });

  if (!remark) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold mb-2">Reflection</h1>
        <p className="text-muted-foreground">by @{handle}</p>
      </div>

      {/* Original Remark */}
      {remark && (
        <div className="bg-muted/50 rounded-lg p-4 border">
          <p className="text-sm text-muted-foreground mb-2">Original Remark</p>
          <p className="italic">&ldquo;{remark.content}&rdquo;</p>
          <p className="text-xs text-muted-foreground mt-2">
            {remark.createdTs.toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Reflection Content */}
      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap">{reflection.content}</div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Reflected on {reflection.createdTs.toLocaleDateString()}</p>
      </div>
    </div>
  );
}
