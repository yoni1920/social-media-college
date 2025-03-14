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
  const [isLoadingAuthFormResponse, setIsLoadingAuthFormResponse] =
    useState(false);

  const navigate = useNavigate();

  const saveUser = useCallback((rawUser: User | null) => {
    if (!rawUser) {
      setUser(null);

      return;
    }

    const { updatedAt, createdAt, ...otherFields } = rawUser;

    setUser({
      ...otherFields,
      updatedAt: new Date(updatedAt),
      createdAt: new Date(createdAt),
    });
  }, []);

  const getUserMe = useCallback(async () => {
    try {
      setIsLoadingUserAuth(true);

      const { data } = await selfAuthApi.post<{ user: User | null }>("/me");

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
      setIsLoadingAuthFormResponse(true);

      await authApi
        .post<{ user: User }>("/login", userLoginData)
        .then(({ data: { user } }) => {
          authResultHandlers?.onSuccess?.(user);
          onAuthenticationSuccess(user);
        })
        .catch((error) => authResultHandlers?.onError?.(error as Error))
        .finally(() => setIsLoadingAuthFormResponse(false));
    },
    [onAuthenticationSuccess]
  );

  const register = useCallback(
    async (
      registrationDTO: RegistrationDTO,
      authResultHandlers?: AuthResultHandlers
    ) => {
      setIsLoadingAuthFormResponse(true);

      await authApi
        .post<{ user: User }>("/registration", registrationDTO)
        .then(({ data: { user } }) => {
          authResultHandlers?.onSuccess?.(user);
          onAuthenticationSuccess(user);
        })
        .catch((error) => authResultHandlers?.onError?.(error as Error))
        .finally(() => setIsLoadingAuthFormResponse(false));
    },
    [onAuthenticationSuccess]
  );

  const logout = useCallback(async () => {
    await authApi.post("/logout");
    navigate("/");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoadingUserAuth,
        getUserMe,
        isLoadingAuthFormResponse,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
