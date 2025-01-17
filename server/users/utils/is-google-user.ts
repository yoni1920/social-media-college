import { CreateGoogleUserDTO, CreateUserDTO } from "../dto-schema";

export const isGoogleUserDTO = (
  user: CreateUserDTO | CreateGoogleUserDTO
): user is CreateGoogleUserDTO => {
  return user.hasOwnProperty("googleId");
};
