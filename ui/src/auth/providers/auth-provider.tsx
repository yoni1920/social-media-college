import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { User } from "../../types";
import { AuthContext, AuthResultHandlers } from "../hooks/use-auth";
import { UserLoginDTO } from "../types/user-login-dto";
import { useNavigate } from "react-router-dom";
import { RegistrationDTO } from "../types/registration-fields";
import { authApi } from "../../api";
import { selfAuthApi } from "../../api/self-auth-api";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUserAuth, setIsLoadingUserAuth] = useState(true);

  const navigate = useNavigate();

  const saveUser = useCallback((rawUser: User | null) => {
    if (!rawUser) {
      setUser(null);

      return;
    }

    const { birthDate, updatedAt, createdAt, ...otherFields } = rawUser;

    setUser({
      ...otherFields,
      updatedAt: new Date(updatedAt),
      createdAt: new Date(createdAt),
      birthDate: new Date(birthDate),
    });
  }, []);

  const getUserMe = useCallback(async () => {
    try {
      const { data } = await selfAuthApi.post<{ user: User | null }>("/me");
      await new Promise((r) => setTimeout(r, 2000));

      saveUser(data.user);
    } catch (error) {
      console.error("Get User Me went wrong", error);
    } finally {
      setIsLoadingUserAuth(false);
    }
  }, [saveUser]);

  useEffect(() => {
    if (!user) {
      getUserMe();
    }
  }, [getUserMe, user]);

  const onAuthenticationSuccess = useCallback(
    (rawUser: User) => {
      saveUser(rawUser);
      navigate("/");
    },
    [navigate, saveUser]
  );

  const login = useCallback(
    async (
      userLoginData: UserLoginDTO,
      authResultHandlers?: AuthResultHandlers
    ) => {
      await authApi
        .post<{ user: User }>("/login", userLoginData)
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
        .post<{ user: User }>("/registration", registrationDTO)
        .then(({ data: { user } }) => {
          authResultHandlers?.onSuccess?.(user);
          onAuthenticationSuccess(user);
        })
        .catch((error) => authResultHandlers?.onError?.(error as Error));
    },
    [onAuthenticationSuccess]
  );

  return (
    <AuthContext.Provider value={{ user, login, register, isLoadingUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
