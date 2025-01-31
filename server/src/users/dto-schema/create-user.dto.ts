import { z } from "zod";

export const createUserSchema = z.strictObject({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email().min(1),
  bio: z.string().optional(),
  name: z.string(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema> & {
  picture: string;
};

export type CreateExternalUserDTO = Omit<CreateUserDTO, "password"> & {
  externalId: string;
  picture: string;
};
