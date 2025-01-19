import { Divider, Stack, Typography } from "@mui/material";
import { AppTitleLogo } from "../../../components/AppTitleLogo";
import { AppCard } from "../../../components/AppCard";
import { RegistrationForm } from "./RegistrationForm";
import { GoogleAuthButton } from "../GoogleAuthButton";

export const Registration = () => {
  return (
    <AppCard>
      <Stack gap={3} my={4} alignItems={"center"}>
        <AppTitleLogo padding={1} variant="h3" />
        <Typography
          textAlign={"center"}
          fontSize={"medium"}
          fontWeight={"light"}
          maxWidth={"70%"}
        >
          Welcome, Sign in with social media or register your information to
          sign up
        </Typography>

        <GoogleAuthButton />

        <Divider sx={{ width: "70%" }}>OR</Divider>

        <RegistrationForm />
      </Stack>
    </AppCard>
  );
};
