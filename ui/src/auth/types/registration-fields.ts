import { z } from "zod";

export const MINIMUM_PASSWORD_LENGTH = 5;

export const registrationSchema = z.strictObject({
  username: z.string().min(1),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
  email: z.string().email(),
  name: z.string(),
});

export type RegistrationDTO = z.infer<typeof registrationSchema>;
