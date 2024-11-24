import { z } from "zod";

export const updateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  birthDate: z.string().date().optional(),
  bio: z.string().optional(),
});
