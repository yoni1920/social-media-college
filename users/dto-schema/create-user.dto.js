import { z } from "zod";

export const createUserSchema = z.strictObject({
  username: z.string().min(1),
  email: z.string().email().min(1),
  birthDate: z.string().date(),
  bio: z.string().optional(),
});
