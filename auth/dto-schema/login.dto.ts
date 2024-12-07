import { z } from "zod";

export const loginSchema = z
  .object({
    password: z.string().min(1),
    email: z.string().optional().or(z.string().min(1)),
    username: z.string().optional().or(z.string().min(1)),
  })
  .refine(
    ({ email, username }) => username !== undefined || email !== undefined,
    {
      message: "User login identification missing, provide email or username",
    }
  );

export type LoginDTO = z.infer<typeof loginSchema>;
