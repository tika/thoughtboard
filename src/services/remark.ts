import { and, eq, isNull, lt } from "drizzle-orm";
import { db } from "@/db/conn";
import { reflectionTable, remarkTable } from "@/db/schema";
import type { IdSchema, UserIdSchema } from "@/lib/utils";
import type {
  CreateRemarkSchema,
  DeleteRemarkSchema,
  GetReadyForReflectionSchema,
} from "@/server/schemas/remark.schema";
import { profileService } from "./profile";

async function createRemark(input: CreateRemarkSchema) {
  // Ensure profile exists before creating remark
  await profileService.findOrCreateProfile(input.userId);

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

// Get the oldest remark ready for reflection (3+ days old, no reflection)
async function getReadyForReflection({ userId }: GetReadyForReflectionSchema) {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const remarks = await db
    .select({
      remark: remarkTable,
    })
    .from(remarkTable)
    .leftJoin(reflectionTable, eq(remarkTable.id, reflectionTable.remarkId))
    .where(
      and(
        eq(remarkTable.userId, userId),
        lt(remarkTable.createdTs, threeDaysAgo),
        isNull(reflectionTable.remarkId),
      ),
    )
    .orderBy(remarkTable.createdTs)
    .limit(1);

  return remarks[0]?.remark ?? null;
}

export const remarkService = {
  create: createRemark,
  getById: getRemarkById,
  delete: deleteRemark,
  getByUserId: getRemarksByUserId,
  getReadyForReflection,
};
