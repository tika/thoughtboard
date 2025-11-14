import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/conn";
import { remarkTable } from "@/db/schema";
import type { idSchema } from "@/lib/utils";

export const editRemarkSchema = z.object({
  content: z.string().min(1).max(280),
  userId: z.cuid(),
});

async function createRemark(input: z.infer<typeof editRemarkSchema>) {
  const data = editRemarkSchema.parse(input);

  const newRemark = await db
    .insert(remarkTable)
    .values({
      content: data.content,
      userId: data.userId,
    })
    .returning();

  return newRemark[0];
}

async function getRemarkById(values: z.infer<typeof idSchema>) {
  const remark = await db
    .select()
    .from(remarkTable)
    .where(eq(remarkTable.id, values.id))
    .limit(1);

  return remark[0] ?? null;
}

export const deleteRemarkSchema = z.object({
  userId: z.cuid(),
  remarkId: z.cuid(),
});

async function deleteRemark(input: z.infer<typeof deleteRemarkSchema>) {
  const data = deleteRemarkSchema.parse(input);

  // Ensure user owns remark
  const remark = await getRemarkById({ id: data.remarkId });

  if (!remark) {
    throw new Error("Remark not found");
  }

  if (remark.userId !== data.userId)
    throw new Error("User does not own remark");

  await db.delete(remarkTable).where(eq(remarkTable.id, data.remarkId));
}

export const remarkService = {
  createRemark,
  getRemarkById,
  deleteRemark,
};
