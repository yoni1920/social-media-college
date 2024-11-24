import { z } from "zod";

export const updatePostSchema = z.strictObject({
  message: z.string().optional(),
});
