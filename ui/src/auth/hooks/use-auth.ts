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
  isLoadingUserAuth: boolean;
  isLoadingAuthFormResponse: boolean;
  login: (
    userCredentials: UserLoginDTO,
    authResultHandlers?: AuthResultHandlers
  ) => Promise<void>;
  register: (
    registrationData: RegistrationDTO,
    authHandlers?: AuthResultHandlers
  ) => Promise<void>;
  logout: () => Promise<void>;
  getUserMe: () => Promise<void>;
};
export const AuthContext = createContext<AuthContextValue>(
  null as unknown as AuthContextValue
);

export const useAuth = () => useContext(AuthContext);

export const useUser = () => {
  const { user, getUserMe } = useAuth();

  return {
    user: user as User,
    refreshSelfUser: getUserMe,
  };
};
