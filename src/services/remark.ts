import { eq } from "drizzle-orm";
import { db } from "@/db/conn";
import { reflectionTable, remarkTable } from "@/db/schema";
import type { IdSchema, UserIdSchema } from "@/lib/utils";
import type {
  CreateRemarkSchema,
  DeleteRemarkSchema,
} from "@/server/schemas/remark.schema";

async function createRemark(input: CreateRemarkSchema) {
  const newRemark = await db
    .insert(remarkTable)
    .values({
      content: input.content,
      userId: input.userId,
    })
    .returning();

  return newRemark[0];
}

async function getRemarkById({ id }: IdSchema) {
  const remark = await db
    .select()
    .from(remarkTable)
    .where(eq(remarkTable.id, id))
    .limit(1);

  return remark[0] ?? null;
}

async function deleteRemark(input: DeleteRemarkSchema) {
  // Ensure user owns remark
  const remark = await getRemarkById({ id: input.remarkId });

  if (!remark) {
    throw new Error("Remark not found");
  }

  if (remark.userId !== input.userId)
    throw new Error("User does not own remark");

  await db.delete(remarkTable).where(eq(remarkTable.id, input.remarkId));
}

// Get all remarks for a user
async function getRemarksByUserId({ id }: UserIdSchema) {
  const remarks = await db
    .select()
    .from(remarkTable)
    .where(eq(remarkTable.userId, id))
    .leftJoin(reflectionTable, eq(remarkTable.id, reflectionTable.remarkId));

  return remarks;
}

export const remarkService = {
  create: createRemark,
  getById: getRemarkById,
  delete: deleteRemark,
  getByUserId: getRemarksByUserId,
};
