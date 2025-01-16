import { User } from "../../types";
import { RegistrationDTO } from "../types/registration-fields";
import { authApi } from "./auth-api";

export const handleSignInUser = async (
  loginData: Record<string, string>,
  onSuccess: (user: User) => void,
  onError: (error: Error) => void
) => {
  await authApi
    .post<{ user: User }>("/login", loginData, {
      withCredentials: true,
    })
    .then(({ data }) => onSuccess(data.user))
    .catch((error) => onError(error as Error));
};

export const handleRegisterUser = async (
  registrationData: RegistrationDTO,
  onSuccess: (user: User) => void,
  onError: (error: Error) => void
) => {
  await authApi
    .post<{ user: User }>("/registration", registrationData, {
      withCredentials: true,
    })
    .then(({ data }) => onSuccess(data.user))
    .catch((error) => onError(error as Error));
};
