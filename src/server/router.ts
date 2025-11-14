import { os } from "@orpc/server";
import { z } from "zod";
import { remarkRouter } from "@/server/routers/remark";

const hello = os.input(z.object({ name: z.string() })).handler(({ input }) => {
  return `Hello, ${input.name}!`;
});

export const appRouter = {
  sayHello: hello,
  remark: remarkRouter,
};

export type AppRouter = typeof appRouter;
