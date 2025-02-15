import { Stack, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import { FormSubmitButton } from "../../../components/FormSubmitButton";
import { HttpStatus } from "../../../enums";
import { useAuth } from "../../hooks/use-auth";
import { CredentialErrors } from "../../types/credential-errors";
import {
  MINIMUM_PASSWORD_LENGTH,
  RegistrationDTO,
  registrationSchema,
} from "../../types/registration-fields";
import { CredentialInput } from "../CredentialInput";
import { MaxCharacterLength } from "../../../enums/max-character-length";

type RegistrationFields = RegistrationDTO & {
  confirmPassword: string;
};

const initialRegistrationFields: RegistrationFields = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  name: "",
};

const initialErrorFields: CredentialErrors<RegistrationFields> = {
  username: { error: false, message: "" },
  password: { error: false, message: "" },
  confirmPassword: { error: false, message: "" },
  email: { error: false, message: "" },
  name: { error: false, message: "" },
};

const getFieldValueError = (value: string): string => {
  if (!value) {
    return "Field cannot be empty";
  }

  if (value.length > MaxCharacterLength.MEDIUM) {
    return `Field can only have up to ${MaxCharacterLength.MEDIUM} characters`;
  }

  return "";
};

export const RegistrationForm = () => {
  const { register, isLoadingAuthFormResponse } = useAuth();

  const [registrationFields, setRegistrationFields] =
    useState<RegistrationFields>(initialRegistrationFields);

  const [registrationFieldErrors, setRegistrationFieldErrors] =
    useState<CredentialErrors<RegistrationFields>>(initialErrorFields);

  const [generalError, setGeneralError] = useState<string>("");

  const updateRegistrationErrors = useCallback(
    <T extends keyof RegistrationFields>(
      field: T,
      isError: boolean,
      errorMessage: string
    ) => {
      setRegistrationFieldErrors((prevErrors) => {
        const errorData = isError
          ? { error: true, message: errorMessage }
          : initialErrorFields[field];

        return {
          ...prevErrors,
          [field]: errorData,
        };
      });
    },
    []
  );

  const onRegistrationTextFieldChange = useCallback(
    <T extends keyof RegistrationFields>(field: T) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const fieldValue = event.currentTarget.value;

        setRegistrationFieldErrors((prevErrors) => ({
          ...prevErrors,
          [field]: getFieldValueError(fieldValue),
        }));

        setRegistrationFields((prevFields) => ({
          ...prevFields,
          [field]: fieldValue,
        }));
      },
    []
  );

  const onPasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newPassword = event.currentTarget.value;

      onRegistrationTextFieldChange("password")(event);

      if (newPassword.length && newPassword.length < MINIMUM_PASSWORD_LENGTH) {
        updateRegistrationErrors(
          "password",
          true,
          `Must be at least ${MINIMUM_PASSWORD_LENGTH} characters`
        );

        return;
      }

      if (newPassword.length && newPassword.length > MaxCharacterLength.LONG) {
        updateRegistrationErrors(
          "password",
          true,
          `Only allowed up to ${MaxCharacterLength.LONG} characters`
        );

        return;
      }

      const confirmPassword = registrationFields.confirmPassword;

      const existsConfirmPasswordMismatch =
        confirmPassword && newPassword !== confirmPassword;

      if (existsConfirmPasswordMismatch) {
        updateRegistrationErrors(
          "confirmPassword",
          true,
          "Confirm password does not match"
        );

        return;
      }

      updateRegistrationErrors("confirmPassword", false, "");
    },
    [
      updateRegistrationErrors,
      registrationFields.confirmPassword,
      onRegistrationTextFieldChange,
    ]
  );

  const onConfirmPasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newConfirmPassword = event.currentTarget.value;
      onRegistrationTextFieldChange("confirmPassword")(event);

      const existsConfirmPasswordMismatch =
        newConfirmPassword &&
        registrationFields.password &&
        newConfirmPassword !== registrationFields.password;

      if (existsConfirmPasswordMismatch) {
        updateRegistrationErrors(
          "confirmPassword",
          true,
          "Confirm password does not match password"
        );
      }
    },
    [
      updateRegistrationErrors,
      registrationFields.password,
      onRegistrationTextFieldChange,
    ]
  );

  const onRegisterError = useCallback((error: Error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === HttpStatus.BAD_REQUEST
    ) {
      setGeneralError(error.response.data.message);
    } else {
      console.error({
        message: "error occurred on login",
        request: "login",
        stack: error?.stack,
        errMessage: error.message,
      });
    }
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { confirmPassword, ...requiredFields } = registrationFields;

      const requiredRegistration: RegistrationDTO = {
        ...requiredFields,
      };

      const parseResult = registrationSchema.safeParse(requiredRegistration);

      if (!parseResult.success) {
        updateRegistrationErrors(
          "email",
          true,
          parseResult.error.errors[0].message
        );

        return;
      }

      await register(requiredRegistration, { onError: onRegisterError });
    },
    [register, onRegisterError, registrationFields, updateRegistrationErrors]
  );

  const isRegisterSubmitDisabled = useMemo(
    () => Object.values(registrationFieldErrors).some(({ error }) => error),
    [registrationFieldErrors]
  );

  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: "100%",
      }}
    >
      <Stack alignItems={"center"} gap={1}>
        <Stack alignItems={"center"} gap={2} width={"100%"}>
          <CredentialInput
            required
            variant="filled"
            value={registrationFields.username}
            onChange={onRegistrationTextFieldChange("username")}
            label="Username"
            error={registrationFieldErrors.username.error}
            helperText={registrationFieldErrors.username.message}
          />

          <CredentialInput
            required
            variant="filled"
            value={registrationFields.email}
            onChange={onRegistrationTextFieldChange("email")}
            label="Email Address"
            error={registrationFieldErrors.email.error}
            helperText={registrationFieldErrors.email.message}
          />

          <CredentialInput
            required
            variant="filled"
            value={registrationFields.name}
            onChange={onRegistrationTextFieldChange("name")}
            label="Name"
            error={registrationFieldErrors.name.error}
            helperText={registrationFieldErrors.name.message}
          />

          <CredentialInput
            type="password"
            required
            variant="filled"
            value={registrationFields.password}
            onChange={onPasswordChange}
            label="Password"
            error={registrationFieldErrors.password.error}
            helperText={registrationFieldErrors.password.message}
          />

          <CredentialInput
            type="password"
            required
            variant="filled"
            value={registrationFields.confirmPassword}
            onChange={onConfirmPasswordChange}
            label="Confirm Password"
            error={registrationFieldErrors.confirmPassword.error}
            helperText={registrationFieldErrors.confirmPassword.message}
          />
        </Stack>

        <Typography color="error" fontSize={"small"}>
          {generalError}
        </Typography>

        <FormSubmitButton
          text="Register"
          disabled={isRegisterSubmitDisabled}
          loading={isLoadingAuthFormResponse}
        />
      </Stack>
    </form>
  );
};
