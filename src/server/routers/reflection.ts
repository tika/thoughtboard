import { os } from "@orpc/server";
import { cuidSchema } from "@/lib/utils";
import {
  createReflectionSchema,
  updateReflectionSchema,
} from "@/server/schemas/reflection.schema";
import { reflectionService } from "@/services/reflection";

export const reflectionRouter = {
  create: os.input(createReflectionSchema).handler(async ({ input }) => {
    return await reflectionService.create(input);
  }),
  getByRemarkId: os.input(cuidSchema).handler(async ({ input }) => {
    return await reflectionService.getByRemarkId({ id: input.id });
  }),
  getById: os.input(cuidSchema).handler(async ({ input }) => {
    return await reflectionService.getById({ id: input.id });
  }),
  update: os.input(updateReflectionSchema).handler(async ({ input }) => {
    return await reflectionService.update(input);
  }),
};

export type ReflectionRouter = typeof reflectionRouter;
