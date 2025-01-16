import { Stack, Typography } from "@mui/material";
import { AppTitleLogo } from "../../components/AppTitleLogo";
import { AuthCard } from "./AuthCard";
import { RegistrationForm } from "./RegistrationForm";

export const Registration = () => {
  return (
    <AuthCard>
      <Stack gap={4} my={4} alignItems={"center"}>
        <AppTitleLogo />
        <Typography
          textAlign={"center"}
          fontSize={"large"}
          fontWeight={"light"}
        >
          Welcome, Register your information to get started
        </Typography>

        <RegistrationForm />
      </Stack>
    </AuthCard>
  );
};
