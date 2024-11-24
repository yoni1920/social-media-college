import { z } from "zod";

export const updateUserSchema = z.strictObject({
  username: z.string().optional(),
  email: z.string().email().optional(),
  birthDate: z.string().date().optional(),
  bio: z.string().optional(),
});
