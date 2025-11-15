import { reflectionRouter } from "@/server/routers/reflection";
import { remarkRouter } from "@/server/routers/remark";

export const appRouter = {
  remark: remarkRouter,
  reflection: reflectionRouter,
};

export type AppRouter = typeof appRouter;
