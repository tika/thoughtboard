import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/conn";
import { remarkTable } from "@/db/schema";

const editRemarkSchema = z.object({
  content: z.string().min(1).max(280),
  userId: z.string(),
});

async function createRemark(input: z.infer<typeof editRemarkSchema>) {
  const newRemark = await db
    .insert(remarkTable)
    .values({
      content: input.content,
      userId: input.userId,
    })
    .returning();

  return newRemark[0];
}

async function getRemarkById(id: string) {
  const remark = await db
    .select()
    .from(remarkTable)
    .where(eq(remarkTable.id, id))
    .limit(1);

  return remark[0] ?? null;
}

async function deleteRemark(id: string) {
  await db.delete(remarkTable).where(eq(remarkTable.id, id));
}

export const remarkService = {
  createRemark,
  getRemarkById,
  deleteRemark,
};
