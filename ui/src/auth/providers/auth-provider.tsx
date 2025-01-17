import { PropsWithChildren, useCallback, useState } from "react";
import { User } from "../../types";
import { AuthContext, AuthResultHandlers } from "../hooks/useAuth";
import { UserLoginDTO } from "../types/user-login-dto";
import { authApi } from "../api";
import { useNavigate } from "react-router-dom";
import { RegistrationDTO } from "../types/registration-fields";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const onAuthenticationSuccess = useCallback(
    (rawUser: User) => {
      const { birthDate, updatedAt, createdAt, ...otherFields } = rawUser;

      setUser({
        ...otherFields,
        updatedAt: new Date(updatedAt),
        createdAt: new Date(createdAt),
        birthDate: new Date(birthDate),
      });

      navigate("/");
    },
    [navigate]
  );

  const login = useCallback(
    async (
      userLoginData: UserLoginDTO,
      authResultHandlers?: AuthResultHandlers
    ) => {
      await authApi
        .post<{ user: User }>("/login", userLoginData, {
          withCredentials: true,
        })
        .then(({ data: { user } }) => {
          authResultHandlers?.onSuccess?.(user);
          onAuthenticationSuccess(user);
        })
        .catch((error) => authResultHandlers?.onError?.(error as Error));
    },
    [onAuthenticationSuccess]
  );

  const register = useCallback(
    async (
      registrationDTO: RegistrationDTO,
      authResultHandlers?: AuthResultHandlers
    ) => {
      await authApi
        .post<{ user: User }>("/registration", registrationDTO, {
          withCredentials: true,
        })
        .then(({ data: { user } }) => {
          authResultHandlers?.onSuccess?.(user);
          onAuthenticationSuccess(user);
        })
        .catch((error) => authResultHandlers?.onError?.(error as Error));
    },
    [onAuthenticationSuccess]
  );

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
