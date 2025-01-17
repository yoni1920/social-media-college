import { Button, Stack, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import { HttpStatus } from "../../enums";
import { useAuth } from "../hooks/use-auth";
import { CredentialErrors } from "../types/credential-errors";
import { UserLoginDTO } from "../types/user-login-dto";
import { isValidEmail } from "../utils";
import { CredentialInput } from "./CredentialInput";

type UserCredentials = {
  userID: string;
  password: string;
};

const initialCredentials: UserCredentials = {
  userID: "",
  password: "",
};

const initalErrors: CredentialErrors<UserCredentials> = {
  userID: { error: false, message: "" },
  password: { error: false, message: "" },
};

export const SignInForm = () => {
  const { login } = useAuth();
  const [userCredentials, setUserCredentials] =
    useState<UserCredentials>(initialCredentials);

  const [credentialErrors, setCredentialErrors] =
    useState<CredentialErrors<UserCredentials>>(initalErrors);

  const [generalError, setGeneralError] = useState<string>("");

  const onUserCredentialsChange = useCallback(
    <T extends keyof UserCredentials>(credentialField: T) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const credential = event.currentTarget.value;

        setCredentialErrors((prevErrors) => {
          const errorData = !credential
            ? { error: true, message: "Field cannot be empty" }
            : initalErrors[credentialField];

          return {
            ...prevErrors,
            [credentialField]: errorData,
          };
        });

        setUserCredentials((prevCredentials) => ({
          ...prevCredentials,
          [credentialField]: credential,
        }));
      },
    []
  );

  const onSignInError = useCallback((error: Error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === HttpStatus.UNAUTHORIZED
    ) {
      setGeneralError(error.response.data.details);
      setCredentialErrors({
        userID: { error: true, message: "" },
        password: { error: true, message: "" },
      });
    } else {
      console.error({
        message: "error occurred on login",
        request: "login",
        stack: error?.stack,
        errMessage: error?.message,
      });
    }
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const userID = userCredentials.userID;
      const userField = isValidEmail(userID) ? "email" : "username";

      const loginData: UserLoginDTO = {
        password: userCredentials.password,
        [userField]: userID,
      };

      await login(loginData, { onError: onSignInError });
    },
    [userCredentials, login, onSignInError]
  );

  const isSubmitDisabled = useMemo(
    () =>
      Object.values(credentialErrors).some(({ message }) => Boolean(message)),
    [credentialErrors]
  );

  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: "100%",
      }}
    >
      <Stack alignItems={"center"} gap={3}>
        <Stack alignItems={"center"} gap={1} width={"100%"}>
          <CredentialInput
            required
            variant="filled"
            value={userCredentials.userID}
            onChange={onUserCredentialsChange("userID")}
            label="Username or Email Address"
            error={credentialErrors.userID.error}
            helperText={credentialErrors.userID.message}
          />
          <CredentialInput
            type="password"
            required
            variant="filled"
            value={userCredentials.password}
            onChange={onUserCredentialsChange("password")}
            label="Password"
            error={credentialErrors.password.error}
            helperText={credentialErrors.password.message}
          />

          <Typography color="error" fontSize={"small"}>
            {generalError}
          </Typography>

          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={isSubmitDisabled}
            sx={{
              background: "linear-gradient(90deg, #1976d2, #4caf50)",
              padding: "0.6rem",
              width: "60%",
            }}
          >
            <Typography fontSize={"medium"}>Sign In</Typography>
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
