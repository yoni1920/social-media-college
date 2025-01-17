import { z } from "zod";

export const MINIMUM_PASSWORD_LENGTH = 5;

export const registrationSchema = z.strictObject({
  username: z.string().min(1),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
  email: z.string().email(),
  birthDate: z.date(),
  name: z.string(),
});

export type RequiredRegistrationFields = z.infer<typeof registrationSchema>;

export type RegistrationDTO = Omit<RequiredRegistrationFields, "birthDate"> & {
  birthDate: string;
};
