import { z } from "zod";

export const updateCommentSchema = z.strictObject({
  message: z.string().min(1),
});

export type UpdateCommentDTO = z.infer<typeof updateCommentSchema>;
