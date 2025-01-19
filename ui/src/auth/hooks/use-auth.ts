import { createContext, useContext } from "react";
import { User } from "../../types";
import { RegistrationDTO } from "../types/registration-fields";
import { UserLoginDTO } from "../types/user-login-dto";

export type AuthResultHandlers = {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
};

type AuthContextValue = {
  user: User | null;
  login: (
    userCredentials: UserLoginDTO,
    authResultHandlers?: AuthResultHandlers
  ) => Promise<void>;
  register: (
    registrationData: RegistrationDTO,
    authHandlers?: AuthResultHandlers
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoadingUserAuth: boolean;
};
export const AuthContext = createContext<AuthContextValue>(
  null as unknown as AuthContextValue
);

export const useAuth = () => useContext(AuthContext);
