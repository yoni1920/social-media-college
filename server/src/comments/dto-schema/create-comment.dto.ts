import { z } from "zod";

export const createCommentSchema = z.strictObject({
  id: z.string().optional(),
  sender: z.string().min(1),
  message: z.string().optional(),
  postID: z.string().min(1),
});

export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
