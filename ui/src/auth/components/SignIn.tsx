import { Button, Stack, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { AppTitleLogo } from "../../components/AppTitleLogo";
import { CredentialErrors } from "../types";
import { AuthCard } from "./AuthCard";
import { CredentialInput } from "./CredentialInput";

type UserCredentials = {
  userID: string;
  password: string;
};

export const SignIn = () => {
  const [userCredentials, setUserCredentials] = useState<UserCredentials>({
    userID: "",
    password: "",
  });

  //   const [generalError, setGeneralError] = useState<string>("");

  const [credentialErrors, setCredentialErrors] = useState<
    CredentialErrors<UserCredentials>
  >({});

  const onUserCredentialsChange = useCallback(
    <T extends keyof UserCredentials>(credentialField: T) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const credential = event.currentTarget.value;

        setCredentialErrors((prevErrors) => {
          const { [credentialField]: _, ...otherErrors } = prevErrors;

          return {
            ...otherErrors,
            ...(!credential
              ? { [credentialField]: "Field cannot be empty" }
              : {}),
          };
        });

        setUserCredentials((prevCredentials) => ({
          ...prevCredentials,
          [credentialField]: credential,
        }));
      },
    []
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    console.log(event);
  };

  return (
    <AuthCard>
      <Stack gap={4} my={4} alignItems={"center"}>
        <AppTitleLogo />

        <Typography
          textAlign={"center"}
          fontSize={"large"}
          fontWeight={"light"}
        >
          Hello again, sign in to continue
        </Typography>
        <form
          onSubmit={onSubmit}
          style={{
            width: "100%",
          }}
        >
          <Stack alignItems={"center"} gap={3}>
            <Stack alignItems={"center"} gap={2} width={"100%"}>
              <CredentialInput
                required
                variant="filled"
                value={userCredentials.userID}
                onChange={onUserCredentialsChange("userID")}
                label="Username or Email Address"
                error={Boolean(credentialErrors?.userID)}
                helperText={credentialErrors?.userID ?? ""}
              />
              <CredentialInput
                type="password"
                required
                variant="filled"
                value={userCredentials.password}
                onChange={onUserCredentialsChange("password")}
                label="Password"
                error={Boolean(credentialErrors?.password)}
                helperText={credentialErrors?.password ?? ""}
              />
            </Stack>

            <Button
              type="submit"
              variant="outlined"
              size="large"
              disabled={Object.keys(credentialErrors).length > 0}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Stack>
    </AuthCard>
  );
};
