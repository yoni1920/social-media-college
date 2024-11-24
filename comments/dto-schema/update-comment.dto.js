import { z } from "zod";

export const updateCommentSchema = z.strictObject({
  message: z.string().min(1),
});
