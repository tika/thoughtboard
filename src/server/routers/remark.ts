import { os } from "@orpc/server";
import { idSchema } from "@/lib/utils";
import {
  deleteRemarkSchema,
  editRemarkSchema,
  remarkService,
} from "@/services/remark";

export const remarkRouter = {
  create: os.input(editRemarkSchema).handler(async ({ input }) => {
    return await remarkService.createRemark(input);
  }),
  getById: os.input(idSchema).handler(async ({ input }) => {
    return await remarkService.getRemarkById({ id: input.id });
  }),
  delete: os.input(deleteRemarkSchema).handler(async ({ input }) => {
    return await remarkService.deleteRemark(input);
  }),
};

export type RemarkRouter = typeof remarkRouter;
