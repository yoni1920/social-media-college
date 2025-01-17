import { Button, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { isAxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import { HttpStatus } from "../../enums";
import { useAuth } from "../hooks/use-auth";
import { CredentialErrors } from "../types/credential-errors";
import {
  MINIMUM_PASSWORD_LENGTH,
  RegistrationDTO,
  registrationSchema,
  RequiredRegistrationFields,
} from "../types/registration-fields";
import { CredentialInput } from "./CredentialInput";

type RegistrationFields = RequiredRegistrationFields & {
  confirmPassword: string;
};

const initialRegistrationFields: RegistrationFields = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  birthDate: new Date(),
  name: "",
};

const initialErrorFields: CredentialErrors<RegistrationFields> = {
  username: { error: false, message: "" },
  password: { error: false, message: "" },
  confirmPassword: { error: false, message: "" },
  email: { error: false, message: "" },
  birthDate: { error: false, message: "" },
  name: { error: false, message: "" },
};

export type RegistrationTextFields = Omit<RegistrationFields, "birthDate">;

export const RegistrationForm = () => {
  const { register } = useAuth();

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
    <T extends keyof RegistrationTextFields>(field: T) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const fieldValue = event.currentTarget.value;

        setRegistrationFieldErrors((prevErrors) => ({
          ...prevErrors,
          [field]: !fieldValue ? "Field cannot be empty" : "",
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

  const onBirthdateChange = useCallback(
    (value: Dayjs | null) => {
      const date = value?.toDate();
      const isInvalidDate = !date || date.toString() === "Invalid Date";

      updateRegistrationErrors(
        "birthDate",
        isInvalidDate,
        !date ? "Field cannot be empty" : "Invalid Date"
      );

      if (!isInvalidDate) {
        setRegistrationFields((prevFields) => ({
          ...prevFields,
          birthDate: date,
        }));
      }
    },
    [updateRegistrationErrors]
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

      const requiredRegistration: RequiredRegistrationFields = {
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

      const { birthDate, ...otherFields } = requiredRegistration;

      const registrationDTO: RegistrationDTO = {
        ...otherFields,
        birthDate: birthDate.toJSON().split("T")[0],
      };

      await register(registrationDTO, { onError: onRegisterError });
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
      <Stack alignItems={"center"} gap={2}>
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

          <DatePicker
            disableFuture
            format="DD/MM/YYYY"
            label="Birthdate"
            onChange={onBirthdateChange}
            value={dayjs(registrationFields.birthDate)}
          />
        </Stack>

        <Typography color="error" fontSize={"small"}>
          {generalError}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isRegisterSubmitDisabled}
          sx={{
            padding: "0.6rem",
            width: "60%",
            background: "linear-gradient(90deg, #1976d2, #4caf50)",
          }}
        >
          Register
        </Button>
      </Stack>
    </form>
  );
};
