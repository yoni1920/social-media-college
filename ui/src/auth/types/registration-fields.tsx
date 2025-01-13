import { z } from "zod";

export const MINIMUM_PASSWORD_LENGTH = 5;

export const registrationSchema = z.strictObject({
  username: z.string().min(1),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MINIMUM_PASSWORD_LENGTH),
  email: z.string().email().min(5),
  birthDate: z.date(),
  name: z.string(),
});

export type RegistrationFields = z.infer<typeof registrationSchema>;
