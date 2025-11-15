import { reflectionRouter } from "@/server/routers/reflection";
import { remarkRouter } from "@/server/routers/remark";
import { profileRouter } from "@/server/routers/profile";

export const appRouter = {
  remark: remarkRouter,
  reflection: reflectionRouter,
  profile: profileRouter,
};

export type AppRouter = typeof appRouter;
