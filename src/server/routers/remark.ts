import { os } from "@orpc/server";
import { cuidSchema, userIdSchema } from "@/lib/utils";
import {
  createRemarkSchema,
  deleteRemarkSchema,
} from "@/server/schemas/remark.schema";
import { remarkService } from "@/services/remark";

export const remarkRouter = {
  create: os.input(createRemarkSchema).handler(async ({ input }) => {
    return await remarkService.createRemark(input);
  }),
  getById: os.input(cuidSchema).handler(async ({ input }) => {
    return await remarkService.getRemarkById({ id: input.id });
  }),
  delete: os.input(deleteRemarkSchema).handler(async ({ input }) => {
    return await remarkService.deleteRemark(input);
  }),
  getByUserId: os.input(userIdSchema).handler(async ({ input }) => {
    return await remarkService.getRemarksByUserId({ id: input.id });
  }),
};

export type RemarkRouter = typeof remarkRouter;
