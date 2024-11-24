import { z } from "zod";

export const createPostSchema = z.strictObject({
  id: z.string().optional(),
  sender: z.string().min(1),
  message: z.string().default(""),
});
