import { CreateExternalUserDTO, CreateUserDTO } from "../dto-schema";

export const isExternalUserDTO = (
  user: CreateUserDTO | CreateExternalUserDTO
): user is CreateExternalUserDTO => {
  return user.hasOwnProperty("externalId");
};
