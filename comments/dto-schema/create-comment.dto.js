import { z } from "zod";

export const createCommentSchema = z.object({
  id: z.string().optional(),
  sender: z.string().min(1),
  message: z.string().default(""),
  postID: z.string().min(1),
});
