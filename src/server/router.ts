import { os } from "@orpc/server";
import { z } from "zod";

const hello = os.input(z.object({ name: z.string() })).handler(({ input }) => {
  return `Hello, ${input.name}!`;
});

export const appRouter = {
  sayHello: hello,
};

export type AppRouter = typeof appRouter;
