import { z } from "zod";

export const updateCommentSchema = z.object({
  message: z.string().min(1),
});
