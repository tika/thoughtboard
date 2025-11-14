import { os } from "@orpc/server";
import { cuidSchema, userIdSchema } from "@/lib/utils";
import {
  createRemarkSchema,
  deleteRemarkSchema,
} from "@/server/schemas/remark.schema";
import { remarkService } from "@/services/remark";

export const remarkRouter = {
  create: os.input(createRemarkSchema).handler(async ({ input }) => {
    return await remarkService.create(input);
  }),
  getById: os.input(cuidSchema).handler(async ({ input }) => {
    return await remarkService.getById({ id: input.id });
  }),
  delete: os.input(deleteRemarkSchema).handler(async ({ input }) => {
    return await remarkService.delete(input);
  }),
  getByUserId: os.input(userIdSchema).handler(async ({ input }) => {
    return await remarkService.getByUserId({ id: input.id });
  }),
};

export type RemarkRouter = typeof remarkRouter;
