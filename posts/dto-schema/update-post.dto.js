import { z } from "zod";

export const updatePostSchema = z.object({
  sender: z.string().optional(),
  message: z.string().optional(),
});
