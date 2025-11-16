import { and, eq, gt, isNotNull, isNull, lt, or, sql } from "drizzle-orm";
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

  // Standard ephemeral Remark creation
  // If remark is created without a reflection, set expiresAt to 72 hours from now
  // Remarks with URLs are still ephemeral - Reflections are created manually later
  const expiresAt = input.reflectionId
    ? undefined
    : new Date(Date.now() + 72 * 60 * 60 * 1000);

  const newRemark = await db
    .insert(remarkTable)
    .values({
      content: input.content,
      userId: input.userId,
      reflectionId: input.reflectionId,
      expiresAt,
    })
    .returning();

  return newRemark[0];
}

async function getRemarkById({ id }: IdSchema) {
  const remark = await db
    .select()
    .from(remarkTable)
    .where(
      and(
        eq(remarkTable.id, id),
        // Filter out expired remarks: keep if reflectionId exists OR expiresAt is in the future
        or(
          isNotNull(remarkTable.reflectionId),
          gt(remarkTable.expiresAt, sql`now()`),
        ),
      ),
    )
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
    .where(
      and(
        eq(remarkTable.userId, id),
        // Filter out expired remarks: keep if reflectionId exists OR expiresAt is in the future
        or(
          isNotNull(remarkTable.reflectionId),
          gt(remarkTable.expiresAt, sql`now()`),
        ),
      ),
    )
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
        // Filter out expired remarks: only get remarks that haven't expired yet
        gt(remarkTable.expiresAt, sql`now()`),
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
