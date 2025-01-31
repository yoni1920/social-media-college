import { User } from "users/user.model";
import { z } from "zod";

export const updateUserSchema = z.strictObject({
  username: z.string().optional(),
  bio: z.string().optional(),
  name: z.string().optional(),
  removePicture: z.boolean().optional(),
  picture: z.string().optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
