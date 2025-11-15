import { eq } from "drizzle-orm";
import { db } from "@/db/conn";
import { reflectionTable } from "@/db/schema";
import type { IdSchema } from "@/lib/utils";
import type {
  CreateReflectionSchema,
  UpdateReflectionSchema,
} from "@/server/schemas/reflection.schema";
import { remarkService } from "@/services/remark";

async function createReflection(input: CreateReflectionSchema) {
  // Ensure Remark doesn't already have a reflection and belongs to the user
  const remark = await remarkService.getById({ id: input.remarkId });

  if (!remark) {
    throw new Error("Remark not found");
  }

  if (remark.userId !== input.userId) {
    throw new Error("User does not own remark");
  }

  const newReflection = await db
    .insert(reflectionTable)
    .values(input)
    .returning();
  return newReflection[0];
}

async function getReflectionByRemarkId({ id }: IdSchema) {
  const reflection = await db
    .select()
    .from(reflectionTable)
    .where(eq(reflectionTable.remarkId, id));
  return reflection;
}

async function getReflectionById({ id }: IdSchema) {
  const [reflection] = await db
    .select()
    .from(reflectionTable)
    .where(eq(reflectionTable.id, id))
    .limit(1);
  return reflection ?? null;
}

async function updateReflection(input: UpdateReflectionSchema) {
  const reflection = await getReflectionByRemarkId({ id: input.remarkId });
  if (!reflection) {
    throw new Error("Reflection not found");
  }
  const updatedReflection = await db
    .update(reflectionTable)
    .set(input)
    .where(eq(reflectionTable.remarkId, input.remarkId));

  return updatedReflection;
}

export const reflectionService = {
  create: createReflection,
  getByRemarkId: getReflectionByRemarkId,
  getById: getReflectionById,
  update: updateReflection,
};
