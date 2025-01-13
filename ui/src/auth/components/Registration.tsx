import { Button, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { AppTitleLogo } from "../../components/AppTitleLogo";
import {
  MINIMUM_PASSWORD_LENGTH,
  RegistrationFields,
} from "../types/registration-fields";
import { CredentialInput } from "./CredentialInput";

const initialRegistrationFields: RegistrationFields = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  birthDate: new Date(),
  name: "",
};

const initialErrorFields: Record<keyof RegistrationFields, string> = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  birthDate: "",
  name: "",
};

export type RegistrationTextFields = Omit<RegistrationFields, "birthDate">;

export const Registration = () => {
  const [registrationFields, setRegistrationFields] =
    useState<RegistrationFields>(initialRegistrationFields);

  const [registrationFieldErrors, setRegistrationFieldErrors] =
    useState<Record<keyof RegistrationFields, string>>(initialErrorFields);

  const updateRegistrationTextErrors = useCallback(
    <T extends keyof RegistrationFields>(
      field: T,
      isError: boolean,
      errorMessage: string
    ) => {
      setRegistrationFieldErrors((prevErrors) => ({
        ...prevErrors,
        [field]: isError ? errorMessage : "",
      }));
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
        updateRegistrationTextErrors(
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
        updateRegistrationTextErrors(
          "confirmPassword",
          true,
          "Confirm password does not match"
        );
      }
    },
    [
      updateRegistrationTextErrors,
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
        updateRegistrationTextErrors(
          "confirmPassword",
          true,
          "Confirm password does not match password"
        );
      }
    },
    [
      updateRegistrationTextErrors,
      registrationFields.password,
      onRegistrationTextFieldChange,
    ]
  );

  const onBirthdateChange = useCallback(
    (value: Dayjs | null) => {
      const date = value?.toDate();
      const isInvalidDate = !date || date.toString() === "Invalid Date";

      updateRegistrationTextErrors(
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
    [updateRegistrationTextErrors]
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    console.log(event);
  };

  return (
    <Stack gap={4} my={4} alignItems={"center"}>
      <AppTitleLogo />
      <Typography textAlign={"center"} fontSize={"large"} fontWeight={"light"}>
        Welcome, Register your information to get started
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
              value={registrationFields.username}
              onChange={onRegistrationTextFieldChange("username")}
              label="Username"
              error={Boolean(registrationFieldErrors.username)}
              helperText={registrationFieldErrors.username}
            />

            <CredentialInput
              required
              variant="filled"
              value={registrationFields.email}
              onChange={onRegistrationTextFieldChange("email")}
              label="Email Address"
              error={Boolean(registrationFieldErrors.email)}
              helperText={registrationFieldErrors.email}
            />

            <CredentialInput
              required
              variant="filled"
              value={registrationFields.name}
              onChange={onRegistrationTextFieldChange("name")}
              label="Name"
              error={Boolean(registrationFieldErrors.name)}
              helperText={registrationFieldErrors.name}
            />

            <CredentialInput
              type="password"
              required
              variant="filled"
              value={registrationFields.password}
              onChange={onPasswordChange}
              label="Password"
              error={Boolean(registrationFieldErrors.password)}
              helperText={registrationFieldErrors.password}
            />

            <CredentialInput
              type="password"
              required
              variant="filled"
              value={registrationFields.confirmPassword}
              onChange={onConfirmPasswordChange}
              label="Confirm Password"
              error={Boolean(registrationFieldErrors.confirmPassword)}
              helperText={registrationFieldErrors.confirmPassword}
            />

            <DatePicker
              disableFuture
              format="DD/MM/YYYY"
              label="Birthdate"
              onChange={onBirthdateChange}
              value={dayjs(registrationFields.birthDate)}
            />
          </Stack>

          <Button
            type="submit"
            variant="outlined"
            size="large"
            disabled={Object.keys(registrationFieldErrors).length > 0}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
